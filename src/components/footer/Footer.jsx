// Site footer: newsletter band + dark footer (links, logo, locations, disclaimers)
import { useSiteState } from '../../store/siteStore'
import LogoMark from '../common/LogoMark'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const contact = useSiteState((s) => s.contact)
  return (
    <footer id="page-footer" className="l-footer">
      <section className="l-section wpb_row us_custom_7ffb2dde height_medium">
        <div className="l-section-h i-cf">
          <div className="g-cols vc_row via_flex valign_top type_default stacking_default">
            <div className="vc_col-sm-12 wpb_column vc_column_container">
              <div className="vc_column-inner">
                <div className="wpb_wrapper">
                  <div className="w-separator size_large" />
                  <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
                    <div className="vc_col-sm-6 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="w-iconbox us_custom_d87d3d4a iconpos_left style_default color_primary align_center no_title">
                            <div className="w-iconbox-icon" style={{ fontSize: "2rem" }}>
                              <i className="fas fa-paper-plane" />
                            </div>
                            <div className="w-iconbox-meta">
                              <div className="w-iconbox-text">
                                <p style={{ color: "#ef742a" }}>
                                  Want to receive discounts, promos, special offers, and 10% off your next purchase?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vc_col-sm-6 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <NewsletterForm />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="l-section wpb_row us_custom_8d45c27c height_small color_footer-top with_img">
        <div className="l-section-img" role="img" aria-label="Image" style={{ backgroundRepeat: "no-repeat", backgroundImage: "url(/assets/images/2019/06/footer-bg-new.webp)" }} />
        <div className="l-section-h i-cf">
          <div className="g-cols vc_row via_flex valign_top type_default stacking_default">
            <div className="vc_col-sm-12 wpb_column vc_column_container">
              <div className="vc_column-inner">
                <div className="wpb_wrapper">
                  <div className="w-separator size_large" />
                  <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
                    <div className="vc_col-sm-4 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="wpb_text_column us_custom_4cfb87d6">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "center" }}>
                                <a href="https://cannabuddy.com//">
                                  Home
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/shop/">
                                  Shop
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/about-us/">
                                  About
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/wholesale/">
                                  Wholesale
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/blog/">
                                  Cannabis Blog
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/contact-us/">
                                  Contact
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/charlotte/">
                                  Dispensary
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/my-account/">
                                  My Account
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/cart/">
                                  Cart
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/privacy-policy/">
                                  Privacy Policy
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/terms-and-conditions/">
                                  Terms and Conditions
                                </a>
                                <br />
                                {" "}
                                <a href="https://cannabuddy.com/html-sitemap/">
                                  Sitemap
                                </a>
                              </p>
                            </div>
                          </div>
                          <div className="w-separator size_medium" />
                          <div className="w-hwrapper valign_middle wrap align_center" style={{ "--hwrapper-gap": "1.2rem" }}>
                            <div className="w-socials us_custom_14d6b9a1 color_link shape_circle style_colored hover_fade" style={{ "--gap": "5px" }}>
                              <div className="w-socials-list">
                                <div className="w-socials-item facebook">
                                  <a target="_blank" rel="nofollow" href="https://www.facebook.com/mycannabuddy/" className="w-socials-item-link" aria-label="Facebook">
                                    <span className="w-socials-item-link-hover" />
                                    <i className="fab fa-facebook" />
                                  </a>
                                  <div className="w-socials-item-popup">
                                    <span>
                                      Facebook
                                    </span>
                                  </div>
                                </div>
                                <div className="w-socials-item twitter">
                                  <a target="_blank" rel="nofollow" href="https://twitter.com/mycannabuddy/" className="w-socials-item-link" aria-label="X">
                                    <span className="w-socials-item-link-hover" />
                                    <i className="fab x-twitter">
                                      <svg style={{ width: "1em", marginBottom: "-.1em" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="presentation">
                                        <path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                      </svg>
                                    </i>
                                  </a>
                                  <div className="w-socials-item-popup">
                                    <span>
                                      X
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vc_col-sm-4 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="site-logo" style={{ textAlign: "center", color: "#fff", fontSize: "1.5rem" }}>
                            <LogoMark />
                            <div className="logo-text logo-text-cannabuddy">
                              CannaBuddy
                              <span>
                                ™
                              </span>
                            </div>
                            <div className="logo-text logo-text-dispensary">
                              Cannabis Dispensary
                            </div>
                          </div>
                          <div className="w-separator size_medium" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "center" }}>
                                <span style={{ color: "#e5e1d7" }}>
                                  Our mission is to serve the highest quality cannabis products online. Shop CBD, CBC, CBG, CBN, Delta 8 THC, Delta 9 THC, Delta 10 THC, and High-THCa products with confidence. Customer Satisfaction is of the highest importance. Please don’t hesitate to reach out. Thanks for shopping CannaBuddy!
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vc_col-sm-4 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="w-separator size_medium" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "left", color: "#e5e1d7" }}>
                                <strong style={{ fontSize: "1.1em" }}>
                                  {"Customer Support: "}
                                </strong>
                                <a href={contact.phoneHref}>{contact.phone}</a>
                              </p>
                            </div>
                          </div>
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <div style={{ color: "#e5e1d7" }}>
                                <a href="https://cannabuddy.com/locations/charlotte/">
                                  <strong style={{ fontSize: "1.1em" }}>
                                    CannaBuddy Cannabis Dispensary – Charlotte
                                  </strong>
                                </a>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  5371 E Independence Blvd
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  Suite A
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  Charlotte
                                </span>
                                {", "}
                                <span>
                                  {"NC "}
                                </span>
                                <span>
                                  28212
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Phone: "}
                                  </strong>
                                  <a href="tel:9805009790">
                                    <span>
                                      (980) 500-9790
                                    </span>
                                  </a>
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Email: "}
                                  </strong>
                                  <a href="mailto:hellocharlotte@cannabuddy.com">
                                    hellocharlotte@cannabuddy.com
                                  </a>
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Hours: "}
                                  </strong>
                                  11:00 AM to 8:00 PM daily.
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <div style={{ color: "#e5e1d7" }}>
                                <a href="https://cannabuddy.com/locations/matthews/">
                                  <strong style={{ fontSize: "1.1em" }}>
                                    CannaBuddy Cannabis Dispensary – Matthews
                                  </strong>
                                </a>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  215 N Ames Street
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  Suite 1000
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  Matthews
                                </span>
                                {", "}
                                <span>
                                  NC
                                </span>
                                {" "}
                                <span>
                                  28105
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Phone: "}
                                  </strong>
                                  <a href="tel:7042662630">
                                    <span>
                                      (704) 266-2630
                                    </span>
                                  </a>
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Email: "}
                                  </strong>
                                  <a href="mailto:helloamesstreet@cannabuddy.com">
                                    helloamesstreet@cannabuddy.com
                                  </a>
                                </span>
                                <br />
                                {" "}
                                <span style={{ marginLeft: "1em", display: "inline-block" }}>
                                  <strong style={{ fontSize: "1.1em" }}>
                                    {"Hours: "}
                                  </strong>
                                  Sun: 2pm – 8p, Mon thru Wed: 4pm – 8pm, Thu: 4pm – 9pm, Fri: 2pm – 10pm, Sat: 12pm – 10pm
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-separator size_medium" />
                  <div className="g-cols wpb_row us_custom_5796eab9 via_flex valign_top type_default stacking_default">
                    <div className="vc_col-sm-12 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "justify", color: "#e5e1d7" }}>
                                Disclaimer: CannaBuddy will not be held responsible for any claims or testimonials regarding medical efficacy of any of our products. The FDA (Food and Drug Administration) has not evaluated any of these statements, nor have the claims been confirmed by FDA-acknowledged research. Neither our staff nor our products are intended to diagnose, cure, prevent, or treat any disease or medical condition. Please consult your physician before including any of our products in your wellness plan.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
                    <div className="vc_col-sm-12 wpb_column vc_column_container">
                      <div className="vc_column-inner">
                        <div className="wpb_wrapper">
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column us_custom_564c68c1 has_text_color">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "justify", color: "#e5e1d7" }}>
                                Regulations surrounding hemp-derived products are complex and constantly changing. Our website is configured to comply with applicable state and local restrictions.
                                <br />
                                {" Customers are responsible for understanding the laws and regulations in their area before purchasing. We reserve the right to limit or refuse shipment of products at our discretion and without notice as laws continue to evolve."}
                              </p>
                            </div>
                          </div>
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "justify", color: "#e5e1d7" }}>
                                THCa Disclaimer: We do not ship THCa products to the following states where THCa is restricted or illegal: Arkansas, Idaho, Oregon, and Rhode Island.
                              </p>
                            </div>
                          </div>
                          <div className="w-separator size_small" />
                          <div className="wpb_text_column us_custom_4792172e has_text_color">
                            <div className="wpb_wrapper">
                              <p style={{ textAlign: "center" }}>
                                {"CannaBuddy "}
                                <span className="copyright">©</span> {new Date().getFullYear()}
                                . All Rights Reserved.
                              </p>
                            </div>
                          </div>
                          <div className="w-separator size_small" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
