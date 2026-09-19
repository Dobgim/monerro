import useMediaQuery from '../../hooks/useMediaQuery'
import AnnouncementBar from './AnnouncementBar'
import SiteLogo from './SiteLogo'
import UpperNav from './UpperNav'
import HeaderSearch from './HeaderSearch'
import HeaderCart from './HeaderCart'
import MegaNav from './MegaNav'

// Impreza header builder layouts (from the site's $us.headerSettings):
//   desktop/laptop  middle: [logo] ........ [upper nav + search + cart]   bottom: [mega nav]
//   tablet/mobile   middle: [mega nav (hamburger)] [logo] [search + cart]   bottom: hidden
const TABLET_QUERY = '(max-width: 1024px)'

const logo = (
  <div className="w-html ush_html_2">
    <SiteLogo />
  </div>
)
const megaNav = (
  <div className="w-html ush_html_3">
    <MegaNav />
  </div>
)
const searchAndCart = (
  <div className="w-hwrapper ush_hwrapper_1 align_right valign_middle" style={{ '--hwrapper-gap': '1.2rem' }}>
    <HeaderSearch />
    <HeaderCart />
  </div>
)

function Row({ at, width, left, center, right }) {
  return (
    <div className={`l-subheader at_${at} ${width}`}>
      <div className="l-subheader-h">
        <div className="l-subheader-cell at_left">{left}</div>
        <div className="l-subheader-cell at_center">{center}</div>
        <div className="l-subheader-cell at_right">{right}</div>
      </div>
    </div>
  )
}

export default function Header() {
  const compact = useMediaQuery(TABLET_QUERY)

  return (
    <header id="page-header" className="l-header pos_static shadow_thin bg_solid id_724645">
      <AnnouncementBar />
      {compact ? (
        <>
          <Row at="middle" width="width_default" left={megaNav} center={logo} right={searchAndCart} />
          <Row at="bottom" width="width_full_with_indents" />
        </>
      ) : (
        <>
          <Row
            at="middle"
            width="width_default"
            left={logo}
            right={
              <div
                className="w-hwrapper hidden_for_tablets hidden_for_mobiles ush_hwrapper_2 cb-upper-nav-container align_right valign_middle"
                style={{ '--hwrapper-gap': '1.2rem' }}
              >
                <UpperNav />
                {searchAndCart}
              </div>
            }
          />
          <Row at="bottom" width="width_full_with_indents" center={megaNav} />
        </>
      )}
      <div className="l-subheader for_hidden hidden" />
    </header>
  )
}
