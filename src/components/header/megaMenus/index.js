import MegaMenuShop from './MegaMenuShop'
import MegaMenuDelta9Thc from './MegaMenuDelta9Thc'
import MegaMenuThca from './MegaMenuThca'
import MegaMenuCbd from './MegaMenuCbd'
import MegaMenuShopByType from './MegaMenuShopByType'
import MegaMenuShopByEffect from './MegaMenuShopByEffect'
import MegaMenuResources from './MegaMenuResources'

const megaMenus = [
  { id: 1, label: "Shop", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuShop },
  { id: 3, label: "Delta 9 THC", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuDelta9Thc },
  { id: 5, label: "THCa", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuThca },
  { id: 7, label: "CBD", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuCbd },
  { id: 9, label: "Shop by Type", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuShopByType },
  { id: 11, label: "Shop by Effect", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuShopByEffect },
  { id: 13, label: "Resources", className: "wp-block-ollie-mega-menu__menu-container menu-width-full menu-justified-center", Panel: MegaMenuResources },
]

export default megaMenus
