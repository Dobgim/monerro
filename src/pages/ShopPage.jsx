import { useSearchParams } from 'react-router-dom'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import LeafLines from '../components/common/LeafLines'
import { Section, Separator } from '../components/common/Section'
import ProductCard from '../components/home/ProductCard'

export default function ShopPage() {
  const products = useSiteState((s) => s.products)
  const [params] = useSearchParams()
  const query = (params.get('s') || '').trim()
  const q = query.toLowerCase()
  const shown = products.filter((p) => p.visible && (!q || p.name.toLowerCase().includes(q)))
  usePageTitle(query ? `Search results for “${query}”` : 'Shop')

  return (
    <Section className="height_medium cb-page">
      <Separator />
      <LeafLines />
      <Separator />
      <div className="wpb_text_column">
        <div className="wpb_wrapper">
          <h1 style={{ textAlign: 'center' }}>{query ? `Search results for “${query}”` : 'Shop All Products'}</h1>
          <p className="cb-page__lead">
            {shown.length} product{shown.length === 1 ? '' : 's'}
            {query && (
              <>
                {' · '}
                <a href="/shop/">Show all products</a>
              </>
            )}
          </p>
        </div>
      </div>
      <Separator />
      {shown.length ? (
        <div className="woocommerce columns-4">
          <ul className="products columns-4">
            {shown.map((product, i) => (
              <ProductCard key={product.id} product={product} first={i % 4 === 0} last={i % 4 === 3} eager={i < 8} />
            ))}
          </ul>
        </div>
      ) : (
        <p className="cb-page__empty">
          Nothing matched “{query}”. Try a shorter word, or <a href="/shop/">browse all products</a>.
        </p>
      )}
    </Section>
  )
}
