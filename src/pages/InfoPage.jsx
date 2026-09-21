import usePageTitle from '../hooks/usePageTitle'
import { Section } from '../components/common/Section'
import PageHero from '../components/common/PageHero'
import ContentBlocks from '../components/common/ContentBlocks'

// Our Story, Order FAQs, Cannabinoid Info, Lab Results, Privacy Policy, Terms
export default function InfoPage({ page }) {
  usePageTitle(page.title)
  return (
    <Section className="height_medium cb-page cb-info">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} image={page.image} />
      <ContentBlocks blocks={page.body} />
    </Section>
  )
}
