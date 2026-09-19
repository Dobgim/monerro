import Header from './components/header/Header'
import HeroSlider from './components/home/HeroSlider'
import IntroSection from './components/home/IntroSection'
import FeaturedProducts from './components/home/FeaturedProducts'
import SelectionSection from './components/home/SelectionSection'
import PremiumSection from './components/home/PremiumSection'
import BrandsSection from './components/home/BrandsSection'
import Footer from './components/footer/Footer'
import TopLink from './components/common/TopLink'

export default function App() {
  return (
    <>
      <div className="l-canvas type_wide">
        <Header />
        <main id="page-content" className="l-main">
          <HeroSlider />
          <IntroSection />
          <FeaturedProducts />
          <SelectionSection />
          <PremiumSection />
          <BrandsSection />
        </main>
      </div>
      <Footer />
      <TopLink />
    </>
  )
}
