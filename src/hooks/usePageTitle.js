import { useEffect } from 'react'

const SITE = 'CannaBuddyHub Cannabis Dispensary'

// Sets the browser tab title for a storefront page ("Product name | CannaBuddyHub…")
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Premium THC & CBD Products`
  }, [title])
}
