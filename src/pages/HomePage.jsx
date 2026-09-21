import usePageTitle from '../hooks/usePageTitle'
import HeroSlider from '../components/home/HeroSlider'
import IntroSection from '../components/home/IntroSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import SelectionSection from '../components/home/SelectionSection'
import PremiumSection from '../components/home/PremiumSection'
import BrandsSection from '../components/home/BrandsSection'

export default function HomePage() {
  usePageTitle(null)
  return (
    <>
      <HeroSlider />
      <IntroSection />
      <FeaturedProducts />
      <SelectionSection />
      <PremiumSection />
      <BrandsSection />
    </>
  )
}
