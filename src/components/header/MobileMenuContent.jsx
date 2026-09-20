// Mobile navigation overlay content (the site's mobile-menu block)
import BlockSearch from './BlockSearch'
import MobileSubmenu from './MobileSubmenu'

export default function MobileMenuContent() {
  return (
    <>
      <div className="wp-block-group is-layout-flow wp-container-core-group-is-layout-06258d62 wp-block-group-is-layout-flow" style={{ paddingTop: "var(--wp--preset--spacing--10)", paddingRight: "var(--wp--preset--spacing--10)", paddingBottom: "var(--wp--preset--spacing--10)", paddingLeft: "var(--wp--preset--spacing--10)" }}>
        <div className="aligncenter wp-block-site-logo">
          <a href="https://cannabuddyhub.com/" className="custom-logo-link" rel="home" aria-current="page">
            <img width="54" height="49" src="/assets/brand/logo.svg" className="custom-logo" alt="CannaBuddyHub" loading="lazy" />
          </a>
        </div>
        <div className="wp-block-group is-layout-grid wp-container-core-group-is-layout-de879071 wp-block-group-is-layout-grid">
          <div className="wp-block-group cb-has-abs-link is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-cb3a9216 wp-block-group-is-layout-flex">
            <figure className="wp-block-image size-thumbnail has-custom-border is-style-default">
              <img width="150" height="150" src="/assets/images/2026/02/2-EnergyMainImage.webp" alt="" className="has-border-color has-border-light-border-color wp-image-724693" style={{ borderWidth: "1px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} loading="lazy" />
            </figure>
            <p className="wp-block-paragraph">
              <a href="https://cannabuddyhub.com/product-category/delta-9-thc/">
                Delta 9 THC
              </a>
            </p>
          </div>
          <div className="wp-block-group cb-has-abs-link is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-cb3a9216 wp-block-group-is-layout-flex">
            <figure className="wp-block-image size-thumbnail has-custom-border is-style-default">
              <img width="150" height="150" src="/assets/images/2026/02/Thcapick.webp" alt="" className="has-border-color has-border-light-border-color wp-image-724755" style={{ borderWidth: "1px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} loading="lazy" />
            </figure>
            <p className="wp-block-paragraph">
              <a href="https://cannabuddyhub.com/product-category/thca/">
                THCa
              </a>
            </p>
          </div>
          <div className="wp-block-group cb-has-abs-link is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-cb3a9216 wp-block-group-is-layout-flex">
            <figure className="wp-block-image size-thumbnail has-custom-border is-style-default">
              <img width="150" height="150" src="/assets/images/2026/02/3-ReliefMainImage.webp" alt="" className="has-border-color has-border-light-border-color wp-image-724694" style={{ borderWidth: "1px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} loading="lazy" />
            </figure>
            <p className="wp-block-paragraph">
              <a href="https://cannabuddyhub.com/product-category/cbd/">
                CBD
              </a>
            </p>
          </div>
        </div>
        <BlockSearch id="wp-block-search__input-16" placeholder="Search products…" buttonClassName="wp-block-search__button has-background has-accent-2-background-color has-icon wp-element-button" />
        <hr className="wp-block-separator has-text-color has-border-light-color has-alpha-channel-opacity has-border-light-background-color has-background is-style-wide" />
        <nav id="nav-17" className="has-medium-font-size is-vertical no-wrap wp-block-navigation is-nowrap is-layout-flex wp-container-core-navigation-is-layout-61002b3d wp-block-navigation-is-layout-flex" aria-label="Menu 4">
          <ul className="wp-block-navigation__container has-medium-font-size is-vertical no-wrap wp-block-navigation">
            <MobileSubmenu label="Shop">
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop/">
                  <span className="wp-block-navigation-item__label">
                    All Products
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/on-sale/">
                  <span className="wp-block-navigation-item__label">
                    Sales & Deals
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/whats-new-at-cannabuddy/">
                  <span className="wp-block-navigation-item__label">
                    What's New
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/bundles/">
                  <span className="wp-block-navigation-item__label">
                    Product Bundles
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/cannabis-brands/">
                  <span className="wp-block-navigation-item__label">
                    Shop by Cannabis Brand
                  </span>
                </a>
              </li>
              <MobileSubmenu label="Shop by Cannabinoid">
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/cbc/">
                    <span className="wp-block-navigation-item__label">
                      CBC
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/cbd/">
                    <span className="wp-block-navigation-item__label">
                      CBD
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/cbg/">
                    <span className="wp-block-navigation-item__label">
                      CBG
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/cbn/">
                    <span className="wp-block-navigation-item__label">
                      CBN
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/delta-8-thc/">
                    <span className="wp-block-navigation-item__label">
                      Delta 8
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/delta-9-thc/">
                    <span className="wp-block-navigation-item__label">
                      Delta 9
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/delta-10-thc/">
                    <span className="wp-block-navigation-item__label">
                      Delta 10
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/delta-11-thc/">
                    <span className="wp-block-navigation-item__label">
                      Delta 11
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/h4cbd/">
                    <span className="wp-block-navigation-item__label">
                      H4CBD
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/hhc/">
                    <span className="wp-block-navigation-item__label">
                      HHC
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/thca/">
                    <span className="wp-block-navigation-item__label">
                      THCa
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/thcb/">
                    <span className="wp-block-navigation-item__label">
                      THCB
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/thch/">
                    <span className="wp-block-navigation-item__label">
                      THCH
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/thcp/">
                    <span className="wp-block-navigation-item__label">
                      THCP
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/product-category/thcv/">
                    <span className="wp-block-navigation-item__label">
                      THCv
                    </span>
                  </a>
                </li>
              </MobileSubmenu>
            </MobileSubmenu>
            <MobileSubmenu label="Shop by Type">
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/concentrates/">
                  <span className="wp-block-navigation-item__label">
                    Concentrates
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/drinks/">
                  <span className="wp-block-navigation-item__label">
                    Drinks
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/edibles/">
                  <span className="wp-block-navigation-item__label">
                    Edibles
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/flower/">
                  <span className="wp-block-navigation-item__label">
                    Flower
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/gummies/">
                  <span className="wp-block-navigation-item__label">
                    Gummies
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/live-resin/">
                  <span className="wp-block-navigation-item__label">
                    Live Resin
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/pre-roll/">
                  <span className="wp-block-navigation-item__label">
                    Pre-Rolls
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/supplements/">
                  <span className="wp-block-navigation-item__label">
                    Supplements
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/topicals/">
                  <span className="wp-block-navigation-item__label">
                    Topicals
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-type/vapes/">
                  <span className="wp-block-navigation-item__label">
                    Vapes
                  </span>
                </a>
              </li>
            </MobileSubmenu>
            <MobileSubmenu label="Shop by Effect">
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-effect/sleep/">
                  <span className="wp-block-navigation-item__label">
                    Sleep
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-effect/energy-focus/">
                  <span className="wp-block-navigation-item__label">
                    Energy & Focus
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/shop-by-effect/relief/">
                  <span className="wp-block-navigation-item__label">
                    Relief
                  </span>
                </a>
              </li>
            </MobileSubmenu>
            <MobileSubmenu label="Resources">
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/order-faqs/">
                  <span className="wp-block-navigation-item__label">
                    Order FAQs
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/about-us/">
                  <span className="wp-block-navigation-item__label">
                    Our Story
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/blog/">
                  <span className="wp-block-navigation-item__label">
                    Cannabis Blog
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/locations">
                  <span className="wp-block-navigation-item__label">
                    Locations
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/faqs/">
                  <span className="wp-block-navigation-item__label">
                    Cannabinoid Info
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/lab-results/">
                  <span className="wp-block-navigation-item__label">
                    Lab Results
                  </span>
                </a>
              </li>
            </MobileSubmenu>
          </ul>
        </nav>
        <hr className="wp-block-separator has-text-color has-border-light-color has-alpha-channel-opacity has-border-light-background-color has-background is-style-wide" />
        <div className="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained" style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", paddingTop: "var(--wp--preset--spacing--20)", paddingBottom: "var(--wp--preset--spacing--20)" }}>
          <nav className="has-medium-font-size items-justified-center is-vertical wp-block-navigation is-content-justification-center is-layout-flex wp-container-core-navigation-is-layout-09ff8851 wp-block-navigation-is-layout-flex" aria-label="Main Nav Upper">
            <ul className="wp-block-navigation__container has-medium-font-size items-justified-center is-vertical wp-block-navigation">
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/wholesale/">
                  <span className="wp-block-navigation-item__label">
                    Wholesale
                  </span>
                </a>
              </li>
              <MobileSubmenu label="Locations">
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/locations/charlotte/">
                    <span className="wp-block-navigation-item__label">
                      Charlotte
                    </span>
                  </a>
                </li>
                <li className="wp-block-navigation-item wp-block-navigation-link">
                  <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/locations/matthews/">
                    <span className="wp-block-navigation-item__label">
                      Matthews
                    </span>
                  </a>
                </li>
              </MobileSubmenu>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/contact-us/">
                  <span className="wp-block-navigation-item__label">
                    Contact Us
                  </span>
                </a>
              </li>
              <li className="wp-block-navigation-item wp-block-navigation-link">
                <a className="wp-block-navigation-item__content" href="https://cannabuddyhub.com/my-account/">
                  <span className="wp-block-navigation-item__label">
                    My Account
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
