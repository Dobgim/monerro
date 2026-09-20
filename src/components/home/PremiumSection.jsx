import { useEffect, useRef, useState } from 'react'
import siteImages from '../../data/siteImages'
import { CenteredText, Section, Separator, ShopAllButton } from '../common/Section'

// Circle photo animates in when scrolled into view (Impreza "us_animate_this")
function AnimatedCircleImage() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const img = siteImages.premiumCircle
  return (
    <div ref={ref} className={`w-image us_custom_47474b22 us_animate_this style_circle align_center${started ? ' start' : ''}`}>
      <div className="w-image-h">
        <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" className="attachment-woocommerce_single size-woocommerce_single" />
      </div>
    </div>
  )
}

export default function PremiumSection() {
  return (
    <Section className="us_custom_60aa5c3e height_medium width_full" rowClassName="valign_middle" rowStyle={{ '--additional-gap': '10px' }}>
      <AnimatedCircleImage />
      <CenteredText heading="A Premium Online Cannabis Dispensary">
        <h6 style={{ textAlign: 'center' }}>
          We’re excited to be a trusted real-world and online resource for premium cannabis products and expert advice. We
          want every consumer to make confident informed decisions about their health. Our friendly, passionate staff are
          happy to accommodate and answer any questions you may have about cannabis products. The best way to get in touch is
          through our <a href="https://cannabuddyhub.com/contact-us/">Contact Us</a> page.
        </h6>
      </CenteredText>
      <Separator size="medium" />
      <ShopAllButton />
    </Section>
  )
}
