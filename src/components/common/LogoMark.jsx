import { useId } from 'react'

// CannaBuddyHub logomark: a leaf inside a ring of three connected "hub" nodes.
export default function LogoMark({ size = 54 }) {
  const gradientId = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} className="cbh-logomark" role="img" aria-label="CannaBuddyHub">
      <defs>
        <linearGradient id={gradientId} x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9ccc65" />
          <stop offset="1" stopColor="#4b8b3b" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="27" fill="none" stroke="#abd590" strokeWidth="2.5" />
      <circle cx="32" cy="5" r="5" fill="#ef742a" />
      <circle cx="8.6" cy="45.5" r="5" fill="#ef742a" />
      <circle cx="55.4" cy="45.5" r="5" fill="#ef742a" />
      <path
        d="M32 13c9.5 6.4 13.5 14.7 13.5 22.2C45.5 43.4 39.6 49.6 32 52c-7.6-2.4-13.5-8.6-13.5-16.8C18.5 27.7 22.5 19.4 32 13Z"
        fill={`url(#${gradientId})`}
      />
      <path d="M32 20v26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".75" />
      <path
        d="M32 30c-3.2-2.4-6.1-3.4-8.8-3.2M32 30c3.2-2.4 6.1-3.4 8.8-3.2M32 39c-3.4-2.2-6.6-3-9.6-2.6M32 39c3.4-2.2 6.6-3 9.6-2.6"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity=".55"
      />
    </svg>
  )
}
