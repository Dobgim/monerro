import { MEDIA_BUCKET, errorText, supabase } from './supabase'

// Photos uploaded in the admin are resized in the browser (so a 12 MB phone photo
// becomes a ~150 KB WebP) and stored in the public "media" bucket in Supabase.

function drawToBlob(source, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      // Safari before 17 can't encode WebP and silently returns PNG — use JPEG there
      canvas.toBlob((webp) => {
        if (webp && webp.type === 'image/webp') return resolve(webp)
        canvas.toBlob((jpg) => (jpg ? resolve(jpg) : reject(new Error('encode'))), 'image/jpeg', quality)
      }, 'image/webp', quality)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unsupported image'))
    }
    img.src = url
  })
}

function newPath(type) {
  const d = new Date()
  const ext = type === 'image/jpeg' ? 'jpg' : 'webp'
  return `uploads/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
}

/** Resize a photo (File or Blob) and upload it. Resolves to its public URL. */
export async function uploadPhoto(file, maxWidth = 1200, quality = 0.85) {
  const blob = await drawToBlob(file, maxWidth, quality)
  const path = newPath(blob.type)
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false })
  if (error) throw new Error(errorText(error))
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Upload an image that is still embedded as a data: URL (from old browser-only saves). */
export async function uploadDataUrl(dataUrl, maxWidth = 1600) {
  const blob = await (await fetch(dataUrl)).blob()
  return uploadPhoto(blob, maxWidth, 0.9)
}

/** Every photo uploaded so far, newest first, for the Media Library. */
export async function listUploads() {
  const out = []
  const walk = async (prefix) => {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(prefix, { limit: 1000, sortBy: { column: 'name', order: 'desc' } })
    if (error) return
    for (const item of data) {
      const path = `${prefix}/${item.name}`
      if (item.id) out.push(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl)
      else await walk(path) // folder (year / month)
    }
  }
  await walk('uploads')
  return out
}
