# CannaBuddy home page — React rebuild

A React (Vite) rebuild of the saved `cannabuddy.com` home page in `../cannabuddy.com`, with the same design and the same images, served in higher resolution.

## Run

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # production build in dist/
```

## Admin dashboard — `/admin`

Open http://localhost:5190/admin and sign in with:

| Email                  | Password        |
| ---------------------- | --------------- |
| `admin@cannabuddy.com` | `cannabuddy123` |

Change these under **Settings** after your first sign-in.

| Section          | What you can do                                                                   |
| ---------------- | --------------------------------------------------------------------------------- |
| **Overview**     | Product, sale and stock counts; add-to-cart activity chart (with a table view); most-added products; latest subscribers |
| **Products**     | Search and filter; add, edit and delete products; reorder the home-page grid; show or hide items; set single, range or sale prices, stars, stock, the Sale badge and the button type; live card preview |
| **Hero slides**  | Add, edit, reorder, hide and delete banner slides and their captions            |
| **Brands**       | Add, edit, reorder, hide and delete partner logos                               |
| **Announcement** | Edit or hide the promo bar at the top of the site                               |
| **Subscribers**  | Sign-ups from the footer form; search, remove, export as CSV                    |
| **Settings**     | Change the admin email and password; download or restore a JSON backup; reset to the original content |

Images can be uploaded (resized in the browser automatically) or picked from the site's existing image library.

**How saving works:** there is no server. Changes are stored in the browser (localStorage) and show up on the storefront immediately, including in other open tabs. So edits live on the computer and browser where they were made; use **Settings → Download backup / Restore** to move them. The sign-in is a client-side gate, **not real security**. Connect a backend (e.g. Supabase or Firebase) before relying on it in production.

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

- Links still point to the real `cannabuddy.com` pages. Only the home page is rebuilt here.
- The third-party widgets (AgeChecker age gate, Klaviyo sign-up, analytics) are not included. A simple sign-up form takes Klaviyo's place.
