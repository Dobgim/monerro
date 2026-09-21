import LeafLines from './LeafLines'

// Top banner for inner pages: breadcrumb, small eyebrow label, title, intro, optional image.
export default function PageHero({ eyebrow, title, intro, image, logo, breadcrumb = [], children }) {
  return (
    <header className={`cb-hero${image ? ' has-image' : ''}`}>
      <nav className="cb-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        {breadcrumb.map((b) => (
          <span key={b.href}>
            <span aria-hidden="true"> / </span>
            <a href={b.href}>{b.label}</a>
          </span>
        ))}
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{title}</span>
      </nav>
      <div className="cb-hero__inner">
        <div className="cb-hero__text">
          {!image && !logo && <LeafLines />}
          {eyebrow && <p className="cb-hero__eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {intro && <p className="cb-hero__intro">{intro}</p>}
          {children}
        </div>
        {image && (
          <div className="cb-hero__media">
            <img src={image} alt="" />
          </div>
        )}
        {logo && (
          <div className="cb-hero__logo">
            <img src={logo} alt="" />
          </div>
        )}
      </div>
    </header>
  )
}
