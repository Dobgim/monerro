import LogoMark from '../common/LogoMark'

export default function SiteLogo() {
  return (
    <div className="site-logo" style={{ textAlign: 'center', color: '#7e1f38', fontSize: '1rem' }}>
      <a href="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }} rel="home">
        <LogoMark />
        <div className="logo-text logo-text-cannabuddy">
          CannaBuddy<span>™</span>
        </div>
        <div className="logo-text logo-text-dispensary">Cannabis Dispensary</div>
      </a>
    </div>
  )
}
