import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { ARTICLES, articlesForTags } from '../content/blog'
import { categoriesOf } from '../lib/catalog'
import { Section, Separator } from '../components/common/Section'
import PageHero from '../components/common/PageHero'
import ArticleCards, { formatDate } from '../components/common/ArticleCards'
import ProductCard from '../components/home/ProductCard'

export function BlogIndexPage() {
  usePageTitle('Cannabis Blog')
  const [featured, ...rest] = ARTICLES
  return (
    <Section className="height_medium cb-page cb-blog">
      <PageHero eyebrow="Resources" title="Cannabis Blog" intro="Guides, explainers and tips to help you choose and enjoy hemp-derived products with confidence." />
      <a className="cb-featured-article" href={`/${featured.slug}/`}>
        <span className="cb-featured-article__img">
          <img src={featured.image} alt="" />
        </span>
        <span className="cb-featured-article__body">
          <span className="cb-article-card__meta">
            Featured · {formatDate(featured.date)} · {featured.readMinutes} min read
          </span>
          <strong>{featured.title}</strong>
          <span>{featured.excerpt}</span>
          <span className="cb-link">Read the article →</span>
        </span>
      </a>
      <Separator size="medium" />
      <ArticleCards articles={rest} />
    </Section>
  )
}

export function ArticlePage({ article }) {
  usePageTitle(article.title)
  const products = useSiteState((s) => s.products)
  const related = products
    .filter((p) => p.visible)
    .filter((p) => {
      const c = categoriesOf(p)
      return [...c.cannabinoids, ...c.types, ...c.effects].some((t) => article.tags.includes(t))
    })
    .slice(0, 4)
  const more = articlesForTags(article.tags, 4).filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <>
      <Section className="height_medium cb-page cb-article">
        <article>
          <PageHero
            eyebrow={`${formatDate(article.date)} · ${article.readMinutes} min read`}
            title={article.title}
            intro={article.excerpt}
            breadcrumb={[{ label: 'Cannabis Blog', href: '/blog/' }]}
          />
          <img className="cb-article__image" src={article.image} alt="" />
          <div className="cb-prose">
            {article.body.map(([type, value], i) =>
              type === 'h2' ? (
                <h2 key={i}>{value}</h2>
              ) : type === 'ul' ? (
                <ul key={i}>
                  {value.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{value}</p>
              ),
            )}
            <p className="cb-disclaimer">{article.disclaimer}</p>
          </div>
        </article>
      </Section>

      {related.length > 0 && (
        <Section className="height_medium cb-related">
          <h2 className="cb-section-title">Shop related products</h2>
          <div className="woocommerce columns-4">
            <ul className="products columns-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} first={i === 0} last={i === 3} />
              ))}
            </ul>
          </div>
        </Section>
      )}

      {more.length > 0 && (
        <Section className="height_medium us_custom_216f3251">
          <h2 className="cb-section-title">Keep reading</h2>
          <ArticleCards articles={more} />
        </Section>
      )}
    </>
  )
}
