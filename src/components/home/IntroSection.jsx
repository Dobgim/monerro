import LeafLines from '../common/LeafLines'
import { Section, Separator } from '../common/Section'

// Orange band under the hero
export default function IntroSection() {
  return (
    <Section className="us_custom_f56f5d57 product-info has_text_color height_medium">
      <Separator />
      <LeafLines color="#fff" />
      <Separator />
      <div className="g-cols wpb_row via_flex valign_top type_default stacking_default">
        <div className="vc_col-sm-12 vc_col-lg-offset-2 vc_col-lg-8 vc_col-sm-offset-0 wpb_column vc_column_container">
          <div className="vc_column-inner">
            <div className="wpb_wrapper">
              <div className="wpb_text_column">
                <div className="wpb_wrapper">
                  <h1 style={{ textAlign: 'center' }}>CannaBuddy Cannabis Dispensary</h1>
                </div>
              </div>
              <Separator />
              <div className="wpb_text_column font-style-head">
                <div className="wpb_wrapper">
                  <h6 style={{ textAlign: 'center' }}>
                    Each person walks their own path to wellness. CannaBuddy is passionate about ensuring customers make positive
                    choices for their health and wellness. As a premium cannabis dispensary, we specialize in promoting a balanced
                    lifestyle and overall sense of well-being. Our team is dedicated to providing potent, tested, and high-quality
                    cannabis products containing cannabinoids such as Delta 8, Delta 9, Delta 10, HHC, THCa, and THCP. We
                    collaborate with North Carolina farmers, local extractors, national manufacturers, testing facilities, and
                    others to offer one of the largest premiere cannabis selections anywhere.
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator size="medium" />
    </Section>
  )
}
