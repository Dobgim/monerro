// Content for the site's information pages.
// Blocks: ['h2', text] ['p', text] ['ul', [items]] ['faq', [[question, answer], ...]] ['cta', 'shop' | 'whatsapp']
// Policies are kept general on purpose — have them reviewed before relying on them.

export const PAGES = {
  'about-us': {
    title: 'Our Story',
    eyebrow: 'About CannaBuddyHub',
    intro: 'A friendly, knowledgeable place to discover premium hemp-derived cannabis products.',
    image: '/assets/images/2019/07/jared-weiss-olwtEqktvzY-unsplash.webp',
    body: [
      ['p', 'CannaBuddyHub started with a simple idea: shopping for cannabis products should feel easy, honest and welcoming. Whether you are completely new or already know exactly what you like, we want you to leave with the right product and the confidence to use it well.'],
      ['h2', 'What we believe'],
      ['ul', [
        'Quality first — we carry brands that test their products with independent labs.',
        'Straight answers — we explain what a product is, how strong it is and what to expect, without the hype.',
        'Everyone’s path is different — from micro-dose gummies to potent concentrates, there is something for every preference.',
      ]],
      ['h2', 'How we help'],
      ['p', 'Browse our curated selection of THCa flower, Delta 9 edibles, CBD, vapes, drinks and more. When you are ready, check out in a few taps and send your order to us on WhatsApp — a real person will confirm it with you and answer any questions.'],
      ['cta', 'shop'],
    ],
  },

  'order-faqs': {
    title: 'Order FAQs',
    eyebrow: 'Resources',
    intro: 'Everything you need to know about ordering, paying and receiving your order.',
    body: [
      ['faq', [
        ['How do I place an order?', 'Add products to your cart and click “Proceed to checkout”. Enter your name and delivery details, choose how you’ll pay, then tap “Pay on WhatsApp”. WhatsApp opens with your order already written — just press Send and we’ll confirm it with you.'],
        ['Which payment methods do you accept?', 'We accept PayPal, Venmo, Zelle, Bitcoin and Cash App. Choose one at checkout. We’ll confirm the total and share payment details on WhatsApp before you pay.'],
        ['When do I pay?', 'After we confirm your order on WhatsApp. Nothing is charged on the website itself.'],
        ['Do you offer delivery or pickup?', 'Both. Choose delivery (and enter your address) or pickup at checkout, and we’ll confirm the timing with you on WhatsApp.'],
        ['How old do I need to be?', 'You must be 21 or older to purchase from CannaBuddyHub. We may ask for proof of age.'],
        ['Do you ship THCa everywhere?', 'No. We do not ship THCa products to states where THCa is restricted, including Arkansas, Idaho, Oregon and Rhode Island. Laws change often, so please check your local rules before ordering.'],
        ['Can I change or cancel my order?', 'Yes — just reply in the same WhatsApp chat as soon as possible, before your order is sent or collected.'],
        ['There’s a problem with my order. What should I do?', 'Message us on WhatsApp or call us with your name and a photo of the issue, and we’ll make it right.'],
        ['Do I need an account?', 'No. You can order as a guest. Your recent orders on this device appear under My Account.'],
      ]],
      ['cta', 'whatsapp'],
    ],
  },

  faqs: {
    title: 'Cannabinoid Info',
    eyebrow: 'Resources',
    intro: 'A plain-English guide to the cannabinoids you’ll find in our shop.',
    body: [
      ['h2', 'The main cannabinoids'],
      ['faq', [
        ['What is THCa?', 'The raw form of THC produced by the hemp plant. It is not intoxicating on its own, but heating it (smoking, vaping or dabbing) converts it into THC.'],
        ['What is Delta 9 THC?', 'The best-known form of THC. Hemp-derived Delta 9 products are made from hemp containing no more than 0.3% Delta 9 THC by dry weight, and most come as measured-dose edibles and drinks.'],
        ['What is Delta 8 THC?', 'A close relative of Delta 9, often described as milder and more clear-headed.'],
        ['What is Delta 10 THC?', 'Another form of THC, usually described as lighter and more upbeat than Delta 8 or Delta 9.'],
        ['What is CBD?', 'Cannabidiol — a non-intoxicating cannabinoid. Full-spectrum CBD contains trace amounts of THC; broad-spectrum and isolate products are THC-free.'],
        ['What are CBN and CBG?', 'Two non-intoxicating cannabinoids. CBN is common in night-time blends; CBG is often used in daytime blends.'],
        ['What are HHC, THCP, THCv and the others?', 'Newer or less common cannabinoids, usually sold in blends. Some, like THCP, are considered much stronger than Delta 9 — always start with a very small amount.'],
      ]],
      ['h2', 'Good to know'],
      ['faq', [
        ['Will these products show up on a drug test?', 'Products containing THC — including full-spectrum CBD, Delta 8 and THCa — can cause a positive result. If you are tested, choose THC-free products.'],
        ['How much should I take?', 'Start low and go slow. Begin with the smallest suggested serving and wait before having more — especially with edibles, which can take up to 2 hours to work.'],
        ['Can I drive after using THC products?', 'No. Never drive or operate machinery after using any product that contains THC.'],
        ['Are these products legal?', 'Hemp-derived products are legal federally when they meet the 0.3% Delta 9 THC limit, but state laws vary and change often. Check the rules where you live.'],
      ]],
      ['p', 'This information is general and educational. It is not medical advice, and our products are not intended to diagnose, treat, cure or prevent any disease.'],
    ],
  },

  'lab-results': {
    title: 'Lab Results',
    eyebrow: 'Resources',
    intro: 'Third-party lab reports tell you exactly what is in a product. Here is how to get and read them.',
    body: [
      ['h2', 'Ask for any product’s report'],
      ['p', 'Want to see the certificate of analysis (COA) for something in our shop? Message us on WhatsApp with the product name and we’ll send it to you.'],
      ['cta', 'whatsapp'],
      ['h2', 'How to read a COA'],
      ['ul', [
        'Cannabinoid profile — the amount of each cannabinoid, often shown as a percentage or mg per serving.',
        'Total THC — for THCa products, this estimates the THC you’ll get after heating.',
        'Delta 9 THC — hemp products must stay at or below 0.3% by dry weight.',
        'Safety panels — tests for pesticides, heavy metals, residual solvents and microbes, marked pass or fail.',
        'Batch number and test date — should match the product you have.',
      ]],
    ],
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    intro: 'How CannaBuddyHub handles your information.',
    body: [
      ['h2', 'What we collect'],
      ['ul', [
        'Order details you send us on WhatsApp — your name, contact details, delivery address, items and payment method.',
        'Your email address, if you sign up for our newsletter.',
        'Your cart, which is stored in your own browser so it’s there when you come back.',
      ]],
      ['h2', 'How we use it'],
      ['p', 'We use your information to confirm and fulfil your orders, reply to your questions and, if you subscribed, send offers and updates. We do not sell your personal information.'],
      ['h2', 'Payments'],
      ['p', 'We never collect card details on this website. Payments are made through the provider you choose (PayPal, Venmo, Zelle, Bitcoin or Cash App), whose own privacy policies apply.'],
      ['h2', 'WhatsApp'],
      ['p', 'Orders are sent through WhatsApp, which is operated by WhatsApp LLC under its own privacy policy.'],
      ['h2', 'Your choices'],
      ['p', 'You can unsubscribe from our emails at any time, and you can ask us to delete the information we hold about you by contacting us.'],
    ],
  },

  'terms-and-conditions': {
    title: 'Terms and Conditions',
    eyebrow: 'Legal',
    intro: 'The terms that apply when you use this website and place an order.',
    body: [
      ['h2', 'Age requirement'],
      ['p', 'You must be 21 or older to use this website and buy our products.'],
      ['h2', 'Local laws'],
      ['p', 'Regulations on hemp-derived products are complex and change often. You are responsible for knowing the laws where you live before ordering. We reserve the right to refuse or cancel any order, including where a product cannot legally be sent.'],
      ['h2', 'Orders and pricing'],
      ['p', 'An order is confirmed only when we confirm it with you on WhatsApp. Prices and availability may change without notice; for products sold in several sizes, the final price is confirmed with you before payment.'],
      ['h2', 'Product information'],
      ['p', 'Product descriptions are for information only. Our products are not intended to diagnose, treat, cure or prevent any disease, and statements about them have not been evaluated by the FDA. Consult your physician before use.'],
      ['h2', 'Contact'],
      ['p', 'Questions about these terms? Contact us and we’ll be happy to help.'],
    ],
  },
}
