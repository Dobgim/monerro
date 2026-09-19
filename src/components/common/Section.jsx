// Shared WPBakery/Impreza row scaffolding so section components only describe their content.

export function Section({ className = '', rowClassName = 'valign_top', rowStyle, children }) {
  return (
    <section className={`l-section wpb_row ${className}`.trim()}>
      <div className="l-section-h i-cf">
        <div className={`g-cols vc_row via_flex ${rowClassName} type_default stacking_default`} style={rowStyle}>
          <div className="vc_col-sm-12 wpb_column vc_column_container">
            <div className="vc_column-inner">
              <div className="wpb_wrapper">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Separator({ size = 'small' }) {
  return <div className={`w-separator size_${size}`} />
}

// Centered 8-of-12 column (offset 2) holding a heading and lead paragraphs
export function CenteredText({ heading, as: Heading = 'h2', children, topSeparator = true }) {
  return (
    <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
      <div className="vc_col-sm-12 vc_col-lg-offset-2 vc_col-lg-8 vc_col-sm-offset-0 wpb_column vc_column_container">
        <div className="vc_column-inner">
          <div className="wpb_wrapper">
            {topSeparator && <Separator />}
            <div className="wpb_text_column">
              <div className="wpb_wrapper">
                <Heading style={{ textAlign: 'center' }}>{heading}</Heading>
              </div>
            </div>
            <Separator />
            <div className="wpb_text_column font-style-head">
              <div className="wpb_wrapper">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShopAllButton() {
  return (
    <div className="w-btn-wrapper align_center">
      <a className="w-btn us-btn-style_1 icon_atleft" href="https://cannabuddy.com/shop/">
        <i className="fas fa-shopping-cart" />
        <span className="w-btn-label">Shop all products</span>
      </a>
    </div>
  )
}
