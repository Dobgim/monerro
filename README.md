# CannaBuddyHub — React storefront + admin dashboard

The shop front end for **cannabuddyhub.com**, built in React (Vite), with a WordPress-style admin
dashboard at `/admin`.

> **Branding note.** The layout, product photos and several banner images in this repo came from
> cannabuddy.com, a different company. The site name, logo, links and email addresses are now
> CannaBuddyHub, but the artwork is not yet original — see "Still to replace" at the bottom.

## Run

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # production build in dist/
```

## Admin dashboard — `/admin`

The dashboard is built to look and work like the WordPress admin, so anyone used to WordPress
already knows where things are: a dark menu on the left, list tables with row actions, an
"Add New" button, a classic editor with a **Publish** box, and the usual admin notices.

Sign in at http://localhost:5190/admin with:

| Username | Password        |
| -------- | --------------- |
| `admin`  | `cannabuddy123` |

(The email address `admin@cannabuddyhub.com` also works as the username.) Change both under
**Settings → Your login** after the first sign-in.

### Adding a product (what the client does)

1. **Products → Add New**
2. Type the product name in the big title box
3. **Product photo → Upload photo** (any phone or camera photo; it is resized automatically) or
   **Media Library** to reuse a photo already on the site
4. Type the price. "One price" is the normal choice; the other options are a price range or a sale price
5. Click **Publish** — the product appears on the home page straight away

Everything else (button type, star rating, links, alt text) sits in a collapsed **More options**
panel, so the main screen stays short.

| Screen           | What it does                                                                      |
| ---------------- | --------------------------------------------------------------------------------- |
| **Dashboard**    | Welcome panel with shortcuts, At a Glance counts, add-to-cart activity chart, latest sign-ups |
| **Products**     | List table with search, filters, row actions, ordering, and a Yes/No switch for showing each product on the home page |
| **Hero Slides**  | The big banner photos and captions, in order                                      |
| **Brands**       | Partner logos, in order                                                            |
| **Announcement** | The promo strip at the top of the site, with a live preview                        |
| **Subscribers**  | Newsletter sign-ups; search, remove, export CSV                                    |
| **Settings**     | Customer support phone, WhatsApp number for orders, payment methods & account details, username/password, backup & restore, reset |

**How saving works:** there is no server. Changes are saved in the browser (localStorage) and show
on the storefront immediately, including in other open tabs. Edits therefore live on the computer
and browser where they were made — use **Settings → Download backup / Restore** to move them.
The sign-in is a client-side gate, **not real security**. Add a backend (e.g. Supabase or Firebase)
before relying on it in production.

## Ordering: checkout page + WhatsApp

1. The shopper clicks **Proceed to checkout** on a product page or in the cart.
2. The **Checkout** page (`/checkout/`) lists the order and asks for their name, optional phone,
   delivery address or pickup, and a payment method: **PayPal, Venmo, Zelle, Bitcoin or Cash App**.
3. **Pay on WhatsApp** opens a chat with the shop's WhatsApp number, with the whole order, the total,
   the chosen payment method and the customer's details already written. They press Send.

Nothing is charged on the website. In **Admin → Settings** the shop owner sets the WhatsApp number,
turns each payment method on or off, and enters where each payment should go (PayPal email, Venmo
username, Zelle email/phone, BTC wallet address, $Cashtag). Filled-in details appear on the checkout
page and in the message; empty ones tell the customer the details will follow on WhatsApp.

## How the design is kept identical

- `src/styles/original.css` holds the site's original stylesheets (Impreza theme, WordPress blocks, WooCommerce, MetaSlider, Ollie mega menu, plus the page's inline theme CSS), concatenated in their original cascade order. All `url()` references point to local copies in `public/assets/`.
- Components render the same class names and markup structure as the WordPress output, so this CSS applies unchanged.
- `src/styles/app.css` is small. It only covers states that jQuery used to toggle, plus the newsletter form.

## Structure

```
src/
  main.jsx                     routes: /admin/* → admin chunk, everything else → storefront chunk
  store/siteStore.js           shared editable data (defaults from src/data + saved edits)
  admin/                       dashboard: pages/, components/, admin.css, auth.js
  App.jsx                      storefront page composition
  context/CartContext.jsx      client-side cart (badge count, "added to cart" toast, localStorage)
  data/                        page content as plain data
    featuredProducts.js        30 products in the original 3 / 3 / 4-column rows
    heroSlides.js              4 hero slides
    brands.js                  40 partner brands
    menuProducts.js            "Featured Products" carousels inside the mega menus
  components/
    header/                    announcement bar, logo, upper nav, search, cart,
                               MegaNav + MegaMenu (click-to-open, full-width panels),
                               ProductCollection carousel, mobile overlay menu
    header/megaMenus/          the 7 mega menu panels (markup mirrors the WP blocks)
    home/                      HeroSlider, IntroSection, FeaturedProducts/ProductCard,
                               SelectionSection, PremiumSection, BrandsSection
    footer/                    Footer, NewsletterForm
    common/                    Section helpers, leaf ornament, logo mark, back-to-top
```

## Behaviour replaced from the original scripts

| Original (jQuery/WP)            | React replacement                                              |
| ------------------------------- | -------------------------------------------------------------- |
| FlexSlider hero                 | `HeroSlider`: 4s autoplay, 1s slide, pause on hover, arrows, keyboard, swipe |
| Ollie mega menu                 | `MegaNav`/`MegaMenu`: click to open, Esc/outside click to close, viewport-width panels |
| Impreza responsive header       | `Header`: switches cell layout at 1024px like the theme's header builder |
| WooCommerce AJAX add to cart    | `CartContext`: spinner, badge count, toast                    |
| Impreza search / scroll effects | `HeaderSearch`, animated circle image, `TopLink`              |

## Images

Every image is stored locally under `public/assets/images/`. The saved page used 150–300px thumbnails. The rebuild uses the full-size WordPress originals instead:

- Large originals are capped at 1600px (hero banners at 2560px) and re-encoded as high-quality WebP.
- Sources that only exist small (the partner logos are 300px originals) are upscaled 2× with Lanczos resampling and light sharpening, so they stay crisp on high-DPI screens.

## Notes

- Pages: home, `/shop/` (with search), `/product/<slug>/`, `/cart/`, `/checkout/`. Other sections (categories, blog, wholesale…) show a "coming soon" page until they are built.
- The third-party widgets (AgeChecker age gate, Klaviyo sign-up, analytics) are not included. A simple sign-up form takes Klaviyo's place.

## Still to replace (brand assets)

The words, links and logo are CannaBuddyHub, but some artwork still belongs to the other company
and should be swapped before the site goes live:

- **Hero banner slides** — the current photos show CannaBuddy-branded cans and their award graphics.
- **House-brand product photos and names** — e.g. "CannaBuddy THCa Crumble", "CannaBuddy Delta 9 THC Seltzer",
  "CannaBuddy Natural Hemp Rolling Papers". Rename them and replace the photos in Products → Edit.
- **The "CannaBuddy" tile in Brands** — remove it, or replace it with your own supplier list.
- **Shop addresses in the footer** — the Charlotte and Matthews street addresses and hours are still the
  other company's (their phone numbers and emails have been removed).
