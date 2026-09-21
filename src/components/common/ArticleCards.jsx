const formatDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// Grid of blog article cards
export default function ArticleCards({ articles }) {
  return (
    <ul className="cb-articles">
      {articles.map((a) => (
        <li key={a.slug}>
          <a href={`/${a.slug}/`} className="cb-article-card">
            <span className="cb-article-card__img">
              <img src={a.image} alt="" loading="lazy" />
            </span>
            <span className="cb-article-card__body">
              <span className="cb-article-card__meta">
                {formatDate(a.date)} · {a.readMinutes} min read
              </span>
              <strong>{a.title}</strong>
              <span className="cb-article-card__excerpt">{a.excerpt}</span>
              <span className="cb-link">Read more →</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export { formatDate }
