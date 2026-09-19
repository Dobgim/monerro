import { useSiteState } from '../../store/siteStore'
import LeafLines from '../common/LeafLines'
import { CenteredText, Section, Separator } from '../common/Section'

const PER_ROW = 4

// Logo tile: on hover the logo drops away and a linked copy slides in from above (pure CSS in the theme)
function BrandTile({ brand }) {
  const img = (src) => (
    <img src={src} alt={brand.name} width={brand.width} height={brand.height} loading="lazy" className="attachment-medium size-medium" />
  )
  return (
    <div className="vc_col-sm-3 wpb_column vc_column_container">
      <div className="vc_column-inner">
        <div className="wpb_wrapper">
          <div className={`w-hwrapper ${brand.valign} wrap align_center`} id="partners" style={{ '--hwrapper-gap': '1.2rem' }}>
            <div className="w-image partner-img-hover align_center">
              <a className="w-image-h" aria-label={brand.ariaLabel} href={brand.href} tabIndex={-1}>
                {img(brand.image)}
              </a>
            </div>
            <div className="w-image partner-img-active align_center">
              <a className="w-image-h" aria-label={brand.ariaLabel} href={brand.href} title={brand.title}>
                {img(brand.activeImage || brand.image)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrandsSection() {
  const brands = useSiteState((s) => s.brands).filter((b) => b.visible)
  const rows = []
  for (let i = 0; i < brands.length; i += PER_ROW) rows.push(brands.slice(i, i + PER_ROW))

  return (
    <>
      <Section className="height_medium">
        <LeafLines />
        <Separator size="medium" />
        <CenteredText heading="Featured Cannabis Brands">
          <h6 style={{ textAlign: 'center' }}>
            CannaBuddy Cannabis Dispensary is proud to partner with some of the most trusted names in the cannabis industry.
            We only collaborate with cannabis brands that believe in the therapeutic and beneficial properties of all
            cannabinoids. Each one ensures quality, potency, and efficacy through rigorous third-party testing. This
            dedication to quality is why we are excited to offer these cannabis brands as part of our online cannabis
            dispensary.
          </h6>
        </CenteredText>
      </Section>
      <Section className="height_medium">
        {rows.map((row, i) => (
          <section key={i} className="l-section wpb_row height_medium">
            <div className="l-section-h i-cf">
              <div className="g-cols vc_row via_flex valign_top type_default stacking_default">
                {row.map((brand) => (
                  <BrandTile key={brand.id} brand={brand} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </Section>
    </>
  )
}
