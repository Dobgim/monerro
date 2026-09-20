// "Shop" mega menu panel. Markup mirrors the original WordPress block output so the theme CSS applies unchanged.
import BlockSearch from '../BlockSearch'
import ProductCollection from '../ProductCollection'
import menuProducts from '../../../data/menuProducts'

export default function MegaMenuShop() {
  return (
    <>
      <div className="wp-block-cover alignwide has-base-color has-text-color has-link-color has-campton-font-family wp-elements-1" style={{ marginTop: "0", marginBottom: "0", paddingTop: "var(--wp--preset--spacing--50)", paddingRight: "var(--wp--preset--spacing--10)", paddingBottom: "var(--wp--preset--spacing--50)", paddingLeft: "var(--wp--preset--spacing--10)", boxShadow: "var(--wp--preset--shadow--medium-dark)" }}>
        <img width="1344" height="756" className="wp-block-cover__image-background wp-image-727288 size-full" alt="" src="/assets/images/2026/03/mega-background.webp" loading="lazy" />
        <span aria-hidden="true" className="wp-block-cover__background has-background-dim" style={{ backgroundColor: "#02839d" }} />
        <div className="wp-block-cover__inner-container is-layout-constrained wp-container-core-cover-is-layout-389ed399 wp-block-cover-is-layout-constrained">
          <BlockSearch id="wp-block-search__input-2" placeholder="Search products..." buttonClassName="wp-block-search__button has-icon wp-element-button" wrapperStyle={{ width: "100%" }} />
          <div className="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-51ef7823 wp-block-columns-is-layout-flex">
            <div className="wp-block-column is-vertically-aligned-top cb-cat-children-section is-layout-flow wp-container-core-column-is-layout-f342ef54 wp-block-column-is-layout-flow" style={{ flexBasis: "50%" }}>
              <div className="wp-block-group is-style-background-blur is-content-justification-left is-layout-flex wp-container-core-group-is-layout-7a576a65 wp-block-group-is-layout-flex" style={{ fontStyle: "normal", fontWeight: "500" }}>
                <figure className="wp-block-image size-us_200_200_crop has-custom-border is-style-default">
                  <a href="https://cannabuddyhub.com/shop">
                    <img width="200" height="200" src="/assets/images/2026/02/1-MainImage.webp" alt="" className="wp-image-724666" style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "0px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "0px", aspectRatio: "1", objectFit: "cover" }} loading="lazy" />
                  </a>
                </figure>
                <div className="wp-block-group wp-container-content-9cfa9a5a is-vertical is-content-justification-left is-layout-flex wp-container-core-group-is-layout-139a8c71 wp-block-group-is-layout-flex" style={{ lineHeight: "2" }}>
                  <p className="wp-block-paragraph">
                    <a href="https://cannabuddyhub.com/shop/">
                      Shop All
                    </a>
                  </p>
                  <p className="wp-block-paragraph">
                    <a href="https://cannabuddyhub.com/product-category/on-sale/">
                      Sales & Deals
                    </a>
                  </p>
                  <p className="wp-block-paragraph">
                    <a href="https://cannabuddyhub.com/whats-new-at-cannabuddy/">
                      What’s New
                    </a>
                  </p>
                  <p className="wp-block-paragraph">
                    <a href="https://cannabuddyhub.com/product-category/bundles/">
                      Product Bundles
                    </a>
                  </p>
                  <p className="wp-block-paragraph">
                    <a href="https://cannabuddyhub.com/cannabis-brands/">
                      Shop by Cannabis Brands
                    </a>
                  </p>
                </div>
              </div>
              <div className="wp-block-group is-style-background-blur is-layout-constrained wp-container-core-group-is-layout-5a7af33b wp-block-group-is-layout-constrained" style={{ paddingTop: "var(--wp--preset--spacing--10)", paddingRight: "var(--wp--preset--spacing--20)", paddingBottom: "var(--wp--preset--spacing--20)", paddingLeft: "var(--wp--preset--spacing--20)" }}>
                <h4 className="wp-block-heading has-text-align-center has-base-color has-text-color has-link-color wp-elements-2 wp-container-content-958eb9dc" id="h-shop-by-cannabinoid" style={{ marginTop: "0", marginBottom: "0", paddingTop: "0", paddingBottom: "0", fontSize: "clamp(0.875rem, 0.875rem + ((1vw - 0.2rem) * 0.526), 1.25rem)" }}>
                  Shop by Cannabinoid
                </h4>
                <div className="wp-block-group is-content-justification-left is-layout-flex wp-container-core-group-is-layout-7acaa7cf wp-block-group-is-layout-flex" style={{ fontStyle: "normal", fontWeight: "500" }}>
                  <figure className="wp-block-image size-us_200_200_crop has-custom-border is-style-default">
                    <img width="200" height="200" src="/assets/images/2026/02/2-MainImage2-e1771967790793.webp" alt="" className="wp-image-724667" style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", aspectRatio: "1", objectFit: "cover" }} loading="lazy" />
                  </figure>
                  <div className="wp-block-group wp-container-content-e0b89f81 is-layout-grid wp-container-core-group-is-layout-9f4cb285 wp-block-group-is-layout-grid" style={{ minHeight: "0px", lineHeight: "2" }}>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/cbc/">
                        CBC
                      </a>
                    </p>
                    <p className="wp-block-paragraph" style={{ fontStyle: "normal", fontWeight: "600" }}>
                      <a href="https://cannabuddyhub.com/product-category/cbd/">
                        CBD
                      </a>
                    </p>
                    <p className="wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/cbg/">
                        CBG
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/cbn/">
                        CBN
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/delta-8-thc/">
                        Delta8
                      </a>
                    </p>
                    <p className="wp-block-paragraph" style={{ fontSize: "em", fontStyle: "normal", fontWeight: "600" }}>
                      <a href="https://cannabuddyhub.com/product-category/delta-9-thc/">
                        Delta 9
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/delta-10-thc/">
                        Delta 10
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/delta-11-thc/">
                        Delta 11
                      </a>
                    </p>
                    <p className="wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/h4cbd/">
                        H4CBD
                      </a>
                    </p>
                    <p className="wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/hhc/">
                        HHC
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph" style={{ fontStyle: "normal", fontWeight: "600" }}>
                      <a href="https://cannabuddyhub.com/product-category/thca/">
                        THCa
                      </a>
                    </p>
                    <p className="wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/thcb/">
                        THCB
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/thch/">
                        THCH
                      </a>
                    </p>
                    <p className="wp-container-content-9f6a57ee wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/thcp/">
                        THCP
                      </a>
                    </p>
                    <p className="wp-block-paragraph">
                      <a href="https://cannabuddyhub.com/product-category/thcv/">
                        THCv
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="wp-block-column is-vertically-aligned-top cb-cat-featured-section is-layout-flow wp-block-column-is-layout-flow" style={{ flexBasis: "50%" }}>
              <div className="wp-block-group is-style-background-blur is-layout-constrained wp-container-core-group-is-layout-02f8d72a wp-block-group-is-layout-constrained" style={{ paddingTop: "var(--wp--preset--spacing--10)", paddingRight: "0", paddingBottom: "var(--wp--preset--spacing--10)", paddingLeft: "0" }}>
                <h4 className="wp-block-heading has-text-align-center has-base-color has-text-color has-link-color wp-elements-3 wp-container-content-958eb9dc" id="h-featured-products" style={{ marginTop: "0", marginBottom: "var(--wp--preset--spacing--20)", paddingTop: "0", paddingRight: "var(--wp--preset--spacing--20)", paddingBottom: "0", paddingLeft: "var(--wp--preset--spacing--20)", fontSize: "clamp(0.875rem, 0.875rem + ((1vw - 0.2rem) * 0.526), 1.25rem)" }}>
                  {" Featured Products "}
                </h4>
                <ProductCollection style={{ width: "480px", margin: "0 auto" }} collection={menuProducts["MegaMenuShop"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
