import GALLERIES from '../data/galleries'

/**
 * All photos for a product: the main photo first, then its gallery.
 * The gallery is what was saved in the admin (Products → Product gallery), or the
 * extra photos the product shipped with.
 */
export function galleryOf(product) {
  const extra = Array.isArray(product.gallery) ? product.gallery : GALLERIES[product.id] || []
  return [...new Set([product.image, ...extra].filter(Boolean))]
}

/** Extra photos only (without the main photo) — what the admin edits. */
export function extraPhotos(product) {
  return galleryOf(product).slice(1)
}
