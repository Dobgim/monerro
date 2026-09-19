import { useMemo } from 'react'
import { useSiteState } from '../../store/siteStore'
import LeafLines from '../common/LeafLines'
import { Section, Separator, ShopAllButton } from '../common/Section'
import ProductCard from './ProductCard'

// Same rhythm as the original page: a row of 3, another row of 3, then 4 per row.
function toGroups(products) {
  return [
    { columns: 3, products: products.slice(0, 3) },
    { columns: 3, products: products.slice(3, 6) },
    { columns: 4, products: products.slice(6) },
  ].filter((g) => g.products.length)
}

export default function FeaturedProducts() {
  const products = useSiteState((s) => s.products)
  const groups = useMemo(() => toGroups(products.filter((p) => p.visible)), [products])

  return (
    <Section className="height_medium">
      <Separator />
      <LeafLines />
      <Separator />
      <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
        <div className="vc_col-sm-3 wpb_column vc_column_container">
          <div className="vc_column-inner">
            <div className="wpb_wrapper" />
          </div>
        </div>
        <div className="vc_col-sm-6 wpb_column vc_column_container">
          <div className="vc_column-inner">
            <div className="wpb_wrapper">
              <div className="wpb_text_column">
                <div className="wpb_wrapper">
                  <h2 style={{ textAlign: 'center' }}>Featured Cannabis Products</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vc_col-sm-3 wpb_column vc_column_container">
          <div className="vc_column-inner">
            <div className="wpb_wrapper" />
          </div>
        </div>
      </div>
      <Separator />
      {groups.map((group, gi) => (
        <div key={gi} className={`woocommerce columns-${group.columns}`}>
          <ul className={`products columns-${group.columns}`}>
            {group.products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                first={i % group.columns === 0}
                last={i % group.columns === group.columns - 1}
                eager={gi === 0}
              />
            ))}
          </ul>
        </div>
      ))}
      <Separator size="medium" />
      <ShopAllButton />
    </Section>
  )
}
