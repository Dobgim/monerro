// Extra product photos by product id (the main photo is the product's `image`).
// Filled in for every product across the store to provide multiple gallery angles and sub-images.
const galleries = {
  "3070": [
    "/assets/images/2026/02/Pure-Roots-Botanicals-Full-Spectrum-Extra-Strength-Muscle-Gel-2-oz-jar-front.webp",
    "/assets/images/2024/11/Mellow-Fellow-Wellness-Softgel-Capsules-Illuminate-Blend-600-mg-Total-Cannabinoids-Combo.webp",
    "/assets/images/2021/12/HolistaPet-CBD-Calming-Soft-Chews-for-Dogs-300-mg-Total-CBD-Combo-1.webp"
  ],
  "5257": [
    "/assets/images/2021/08/3Chi-Granddaddy-Purple-Delta-8-THC-Vape-Cartridge-with-Botanical-Derived-Terpenes.webp",
    "/assets/images/2021/03/PharmaTHC-Delta-8-THC-Vape-Cartridge-Trainwreck-Combo.webp",
    "/assets/images/2020/09/Yocan-UNI-Pro-Universal-Portable-Box-Mod-Battery---Black-product-2.webp"
  ],
  "210379": [
    "/assets/images/2022/08/Ooze-Slim-Twist-Pen-2.0-Vape-Battery---Rasta-Product.webp",
    "/assets/images/2021/08/3Chi-Granddaddy-Purple-Delta-8-THC-Vape-Cartridge-with-Botanical-Derived-Terpenes.webp",
    "/assets/images/2021/03/PharmaTHC-Delta-8-THC-Vape-Cartridge-Trainwreck-Combo.webp"
  ],
  "211375": [
    "/assets/images/2021/08/3Chi-Granddaddy-Purple-Delta-8-THC-Vape-Cartridge-with-Botanical-Derived-Terpenes.webp",
    "/assets/images/2019/09/Gold-Standard-CBD-450-mg-Natural-Vape-Cartridge-Combo.webp",
    "/assets/images/2020/09/Yocan-UNI-Pro-Universal-Portable-Box-Mod-Battery---Black-product-2.webp"
  ],
  "253314": [
    "/assets/images/2021/03/PharmaTHC-Delta-8-THC-Vape-Cartridge-Trainwreck-Combo.webp",
    "/assets/images/2019/09/Gold-Standard-CBD-450-mg-Natural-Vape-Cartridge-Combo.webp",
    "/assets/images/2022/08/Ooze-Slim-Twist-Pen-2.0-Vape-Battery---Rasta-Product.webp"
  ],
  "404607": [
    "/assets/images/2019/09/HempLucid-Full-Spectrum-CBD-Tincture-in-MCT-Oil-600-mg-CBD.webp",
    "/assets/images/2026/02/Pure-Roots-Botanicals-Full-Spectrum-Extra-Strength-Muscle-Gel-2-oz-jar-front.webp"
  ],
  "411113": [
    "/assets/images/2023/07/PharmaTHC-Delta-10-THC-Gummies-Blackberry-Lemonade-250-mg-Total-Delta-10-THC-combo.webp",
    "/assets/images/2023/07/Galaxy-Treats-Moon-Babies-Delta-9-THC-Gummies-Berry-Melon-Lifter-200-mg-Total-Delta-9-THC-280-m-combo.webp",
    "/assets/images/2021/08/3Chi-Granddaddy-Purple-Delta-8-THC-Vape-Cartridge-with-Botanical-Derived-Terpenes.webp"
  ],
  "446748": [
    "/assets/images/2020/09/Yocan-UNI-Pro-Universal-Portable-Box-Mod-Battery---Black-product-2.webp",
    "/assets/images/2021/08/3Chi-Granddaddy-Purple-Delta-8-THC-Vape-Cartridge-with-Botanical-Derived-Terpenes.webp",
    "/assets/images/2021/03/PharmaTHC-Delta-8-THC-Vape-Cartridge-Trainwreck-Combo.webp"
  ],
  "474032": [
    "/assets/images/2024/08/High-THCa-Flower-Georgia-Pie-Bud.webp",
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Pile.webp",
    "/assets/images/2025/07/THCa-Flower-Green-Crack-Jars-Group-Shot-1.webp"
  ],
  "475464": [
    "/assets/images/2026/07/PharmaTHC-THCa-Sugar-Wax-Modified-Grapes-combo.webp",
    "/assets/images/2025/02/PharmaTHC-THCa-Crumble-Blueberry-Muffin-2-grams-combo-scaled.webp",
    "/assets/images/2024/03/CannaBuddy-THCa-Crumble-Pineapple-Express-1-gram-Jar-Front.webp"
  ],
  "477167": [
    "/assets/images/2023/05/Hemplucid-Stress-Mushroom-Gummies---Watermelon-750-mg-Total-CBD-75-mg-Total-Delta-9-THC-combo.webp",
    "/assets/images/2022/01/3Chi-THCV-Gummies-200-mg-Total-Delta-8-THC-100-mg-Total-THCV-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-Excite-Gummies-Wild-Cherry-100-mg-Delta-9-THC-Total-Combo.webp"
  ],
  "481076": [
    "/assets/images/2023/02/Kush-Kube-Delta-9-_-CBD-Gummies-Pina-Colada-Combo.webp",
    "/assets/images/2022/01/3Chi-THCV-Gummies-200-mg-Total-Delta-8-THC-100-mg-Total-THCV-Combo.webp",
    "/assets/images/2019/09/HempLucid-Full-Spectrum-CBD-Tincture-in-MCT-Oil-600-mg-CBD.webp"
  ],
  "509896": [
    "/assets/images/2023/07/PharmaTHC-Delta-10-THC-Gummies-Blackberry-Lemonade-250-mg-Total-Delta-10-THC-combo.webp",
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2023/02/Kush-Kube-Delta-9-_-CBD-Gummies-Pina-Colada-Combo.webp"
  ],
  "510087": [
    "/assets/images/2023/07/Galaxy-Treats-Moon-Babies-Delta-9-THC-Gummies-Berry-Melon-Lifter-200-mg-Total-Delta-9-THC-280-m-combo.webp",
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2022/01/3Chi-THCV-Gummies-200-mg-Total-Delta-8-THC-100-mg-Total-THCV-Combo.webp"
  ],
  "517620": [
    "/assets/images/2025/05/Cycling-Frog-High-Potency-THC-CBD-Seltzer-4-Pack-Raspberry-Lemonade-combo-1.webp",
    "/assets/images/2025/03/Cheeba-Chews-Delta-9-and-CBC-and-CBD-Salted-Caramel-Chews-Joint-Relief-50-mg-Total-Cannabinoids-combo.webp",
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-and-CBD-Dark-Chocolate-Bar-Combo.jpg.webp"
  ],
  "519650": [
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Pile.webp",
    "/assets/images/2024/01/THCa-Flower-Amnesia-Haze-Bud-.webp",
    "/assets/images/2025/07/THCa-Flower-Green-Crack-Jars-Group-Shot-1.webp"
  ],
  "529770": [
    "/assets/images/2023/11/Mellow-Fellow-Picassos-Euphoria-Blend-Live-Resin-Disposable-Vape-Strawberry-Amnesia-combo-scaled.webp",
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Papaya-Bomb-combo.webp",
    "/assets/images/2021/03/PharmaTHC-Delta-8-THC-Vape-Cartridge-Trainwreck-Combo.webp"
  ],
  "530193": [
    "/assets/images/2023/10/Mellow-Fellow-2-gram-Desire-Blend-Live-Resin-Disposable-Vape-Cali-Gas-Combo.webp",
    "/assets/images/2026/06/PharmaTHC-THCa-Diamond-Infused-and-Live-Resin-Halo-Spark-Disposable-Vape-Purple-Punch-box-front.webp",
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Super-Lemon-Haze-combo.webp"
  ],
  "542011": [
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Bud.webp",
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Pile.webp",
    "/assets/images/2025/07/THCa-Flower-Green-Crack-Jars-Group-Shot-1.webp"
  ],
  "573038": [
    "/assets/images/2024/04/CannaBuddy-THCa-Crumble-Trainwreck-1-gram-Jar-Front.webp",
    "/assets/images/2026/07/PharmaTHC-THCa-Diamonds-combo.webp",
    "/assets/images/2026/07/PharmaTHC-THCa-Sugar-Wax-Modified-Grapes-combo.webp"
  ],
  "576569": [
    "/assets/images/2024/03/CannaBuddy-THCa-Crumble-Pineapple-Express-1-gram-Jar-Front.webp",
    "/assets/images/2026/07/PharmaTHC-THCa-Sugar-Wax-Modified-Grapes-combo.webp",
    "/assets/images/2026/07/PharmaTHC-THCa-Diamonds-combo.webp"
  ],
  "607028": [
    "/assets/images/2025/01/THCa-Flower-Pre-Roll-Georgia-Pie-Pre-Roll-with-Tube-1.webp",
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Pile.webp",
    "/assets/images/2025/07/THCa-Flower-Green-Crack-Jars-Group-Shot-1.webp"
  ],
  "612260": [
    "/assets/images/2024/08/High-THCa-Flower-Georgia-Pie-Bud.webp",
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-.webp"
  ],
  "627129": [
    "/assets/images/2024/12/Wyld-Delta-9-CBG-Refresh-Gummies-Pear-10-Count-100-mg-Delta-9-THC-100-mg-CBG-Total-Combo.webp",
    "/assets/images/2024/11/Wyld-Delta-9-CBD-Low-Dose-Calm-Gummies-Strawberry-10-Count-20-mg-Delta-9-THC-200-mg-CBD-Total-Combo.webp",
    "/assets/images/2025/02/Wana-Optimals-Fast-Asleep-Gummies-160-Total-Cannabinoids-combo-scaled.webp"
  ],
  "627133": [
    "/assets/images/2024/12/Wyld-Delta-9-CBN-Sleep-Gummies-Elderberry-10-Count-100-mg-Delta-9-THC-50-mg-CBN-Total-Combo.webp",
    "/assets/images/2024/11/Wyld-Delta-9-CBD-Low-Dose-Calm-Gummies-Strawberry-10-Count-20-mg-Delta-9-THC-200-mg-CBD-Total-Combo.webp",
    "/assets/images/2025/09/Camino-Sours-Delta-9-THC-and-CBD-Balance-Gummies-Orchard-Peach-Combo.webp"
  ],
  "627135": [
    "/assets/images/2024/12/Wyld-Delta-9-CBG-Refresh-Gummies-Pear-10-Count-100-mg-Delta-9-THC-100-mg-CBG-Total-Combo.webp",
    "/assets/images/2024/12/Wyld-Delta-9-CBN-Sleep-Gummies-Elderberry-10-Count-100-mg-Delta-9-THC-50-mg-CBN-Total-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-Excite-Gummies-Wild-Cherry-100-mg-Delta-9-THC-Total-Combo.webp"
  ],
  "627431": [
    "/assets/images/2019/09/HempLucid-Full-Spectrum-CBD-Tincture-in-MCT-Oil-600-mg-CBD.webp",
    "/assets/images/2025/08/Viia-CBG-and-CBD-Flowstate-Focus-Gummies-THC-Free-Combo.webp"
  ],
  "639725": [
    "/assets/images/2024/08/High-THCa-Flower-Georgia-Pie-Bud.webp",
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-.webp",
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-combo.webp"
  ],
  "643131": [
    "/assets/images/2024/12/Wyld-Delta-9-CBN-Sleep-Gummies-Elderberry-10-Count-100-mg-Delta-9-THC-50-mg-CBN-Total-Combo.webp",
    "/assets/images/2025/02/Wana-Optimals-Fast-Asleep-Gummies-160-Total-Cannabinoids-combo-scaled.webp",
    "/assets/images/2025/01/Camino-Delta-9-Excite-Gummies-Wild-Cherry-100-mg-Delta-9-THC-Total-Combo.webp"
  ],
  "643147": [
    "/assets/images/2025/09/Camino-Sours-Delta-9-THC-and-CBD-Balance-Gummies-Orchard-Peach-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-and-CBN-Sleep-Gummies-Midnight-Blueberry-100-mg-Delta-9-THC-20-mg-CBN-Total-combo.webp",
    "/assets/images/2024/11/Wyld-Delta-9-CBD-Low-Dose-Calm-Gummies-Strawberry-10-Count-20-mg-Delta-9-THC-200-mg-CBD-Total-Combo.webp"
  ],
  "643163": [
    "/assets/images/2025/09/Erth-Wellness-Delta-9-THC-Live-Resin-Chocolate-Bar-Cereal-Milk-Hybrid-combo.webp",
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2025/12/Pure-Roots-Botanicals-THC-Live-Rosin-Gummies-Variety-4-Pack-combo.webp"
  ],
  "644610": [
    "/assets/images/2026/07/PharmaTHC-THCa-Diamonds-combo.webp",
    "/assets/images/2026/07/PharmaTHC-THCa-Sugar-Wax-Modified-Grapes-combo.webp",
    "/assets/images/2024/03/CannaBuddy-THCa-Crumble-Pineapple-Express-1-gram-Jar-Front.webp"
  ],
  "644648": [
    "/assets/images/2024/12/Wyld-Delta-9-CBN-Sleep-Gummies-Elderberry-10-Count-100-mg-Delta-9-THC-50-mg-CBN-Total-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-and-CBN-Sleep-Gummies-Midnight-Blueberry-100-mg-Delta-9-THC-20-mg-CBN-Total-combo.webp",
    "/assets/images/2025/08/Viia-Delta-9-and-CBD-Cloud-9-Relief-Gummies-10-mg-THC-Combo.webp"
  ],
  "651039": [
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-Dark-Chocolate-Bar-Combo.jpg.webp",
    "/assets/images/2025/09/Erth-Wellness-Delta-9-THC-Live-Resin-Chocolate-Bar-Cereal-Milk-Hybrid-combo.webp",
    "/assets/images/2023/08/Cycling-Frog-Wintergreen-Mints-40-mg-Delta-9-THC-200-mg-CBD-Total-Combo-1.webp"
  ],
  "662836": [
    "/assets/images/2025/08/CannaBuddy-Delta-9-THC-Seltzer-6-Pack-Hazy-Sunrise-Combo.jpg.webp",
    "/assets/images/2023/08/Cycling-Frog-Wintergreen-Mints-40-mg-Delta-9-THC-200-mg-CBD-Total-Combo-1.webp"
  ],
  "672239": [
    "/assets/images/2025/12/Pure-Roots-Botanicals-THC-Live-Rosin-Gummies-Variety-4-Pack-combo.webp",
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2024/11/Wyld-Delta-9-CBD-Low-Dose-Calm-Gummies-Strawberry-10-Count-20-mg-Delta-9-THC-200-mg-CBD-Total-Combo.webp"
  ],
  "674029": [
    "/assets/images/2025/05/Cycling-Frog-High-Potency-THC-CBD-Seltzer-4-Pack-Raspberry-Lemonade-combo-1.webp",
    "/assets/images/2023/08/Cycling-Frog-Wintergreen-Mints-40-mg-Delta-9-THC-200-mg-CBD-Total-Combo-1.webp"
  ],
  "674414": [
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-and-CBD-Dark-Chocolate-Bar-Combo.jpg.webp",
    "/assets/images/2025/09/Erth-Wellness-Delta-9-THC-Live-Resin-Chocolate-Bar-Cereal-Milk-Hybrid-combo.webp",
    "/assets/images/2025/03/Cheeba-Chews-Delta-9-and-CBC-and-CBD-Salted-Caramel-Chews-Joint-Relief-50-mg-Total-Cannabinoids-combo.webp"
  ],
  "674423": [
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-Dark-Chocolate-Bar-Combo.jpg.webp",
    "/assets/images/2025/09/Erth-Wellness-Delta-9-THC-Live-Resin-Chocolate-Bar-Cereal-Milk-Hybrid-combo.webp",
    "/assets/images/2025/03/Cheeba-Chews-Delta-9-and-CBC-and-CBD-Salted-Caramel-Chews-Joint-Relief-50-mg-Total-Cannabinoids-combo.webp"
  ],
  "675887": [
    "/assets/images/2025/08/THCa-Flower-Green-Crack-Pile.webp",
    "/assets/images/2025/07/THCa-Flower-Green-Crack-Jars-Group-Shot-1.webp",
    "/assets/images/2024/01/THCa-Flower-Amnesia-Haze-Bud-.webp"
  ],
  "684795": [
    "/assets/images/2025/08/Viia-CBG-and-CBD-Flowstate-Focus-Gummies-THC-Free-Combo.webp",
    "/assets/images/2025/03/Cheeba-Chews-Delta-9-and-CBC-and-CBD-Salted-Caramel-Chews-Joint-Relief-50-mg-Total-Cannabinoids-combo.webp",
    "/assets/images/2023/08/Cycling-Frog-Wintergreen-Mints-40-mg-Delta-9-THC-200-mg-CBD-Total-Combo-1.webp"
  ],
  "685008": [
    "/assets/images/2025/08/Viia-Delta-9-and-CBD-Cloud-9-Relief-Gummies-10-mg-THC-Combo.webp",
    "/assets/images/2024/12/Wyld-Delta-9-CBG-Refresh-Gummies-Pear-10-Count-100-mg-Delta-9-THC-100-mg-CBG-Total-Combo.webp",
    "/assets/images/2024/11/Mellow-Fellow-Wellness-Softgel-Capsules-Illuminate-Blend-600-mg-Total-Cannabinoids-Combo.webp"
  ],
  "688068": [
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-Dark-Chocolate-Bar-Combo.jpg.webp",
    "/assets/images/2025/08/Kind-Oasis-Delta-9-THC-and-CBD-Dark-Chocolate-Bar-Combo.jpg.webp",
    "/assets/images/2025/06/Erth-Wellness-THC-Live-Resin-Gummies-Granddaddy-Purple-Combo.webp"
  ],
  "689127": [
    "/assets/images/2025/01/Camino-Delta-9-Excite-Gummies-Wild-Cherry-100-mg-Delta-9-THC-Total-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-and-CBN-Sleep-Gummies-Midnight-Blueberry-100-mg-Delta-9-THC-20-mg-CBN-Total-combo.webp",
    "/assets/images/2024/12/Wyld-Delta-9-CBG-Refresh-Gummies-Pear-10-Count-100-mg-Delta-9-THC-100-mg-CBG-Total-Combo.webp"
  ],
  "689469": [
    "/assets/images/2025/09/Fall-Wellness-Bundle-transborder-scaled.webp",
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Super-Lemon-Haze-combo.webp"
  ],
  "689507": [
    "/assets/images/2025/09/Simply-the-Best-Bundle-Update-1024-x-1024-2.webp",
    "/assets/images/2024/12/Wyld-Delta-9-CBN-Sleep-Gummies-Elderberry-10-Count-100-mg-Delta-9-THC-50-mg-CBN-Total-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-and-CBN-Sleep-Gummies-Midnight-Blueberry-100-mg-Delta-9-THC-20-mg-CBN-Total-combo.webp"
  ],
  "706947": [
    "/assets/images/2026/07/PharmaTHC-Euphoria-Blend-Triple-THC-Gummies-Wild-Watermelon-combo.webp",
    "/assets/images/2025/06/Erth-Wellness-THC-Live-Resin-Gummies-Granddaddy-Purple-Combo.webp",
    "/assets/images/2024/12/Wyld-Delta-9-CBG-Refresh-Gummies-Pear-10-Count-100-mg-Delta-9-THC-100-mg-CBG-Total-Combo.webp"
  ],
  "723836": [
    "/assets/images/2019/09/HempLucid-Full-Spectrum-CBD-Tincture-in-MCT-Oil-600-mg-CBD.webp",
    "/assets/images/2024/11/Mellow-Fellow-Wellness-Softgel-Capsules-Illuminate-Blend-600-mg-Total-Cannabinoids-Combo.webp",
    "/assets/images/2025/12/Pure-Roots-Botanicals-THC-Live-Rosin-Gummies-Variety-4-Pack-combo.webp"
  ],
  "733599": [
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousycombo.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-product.webp",
    "/assets/images/2026/04/THCa-Flower-Dogwalker-Pre-Rolls-Jet-Fuel-jar.webp"
  ],
  "734616": [
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousycombo.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-product.webp",
    "/assets/images/2026/04/THCa-Flower-Dogwalker-Pre-Rolls-Nerd-Runtz-jar.webp"
  ],
  "734619": [
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousycombo.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-product.webp",
    "/assets/images/2026/07/THCa-Flower-Blunt-Nerd-Runtz_Multiple.webp"
  ],
  "739719": [
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Super-Lemon-Haze-combo.webp",
    "/assets/images/2023/11/Mellow-Fellow-Picassos-Euphoria-Blend-Live-Resin-Disposable-Vape-Strawberry-Amnesia-combo-scaled.webp",
    "/assets/images/2023/10/Mellow-Fellow-2-gram-Desire-Blend-Live-Resin-Disposable-Vape-Cali-Gas-Combo.webp"
  ],
  "741657": [
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Super-Lemon-Haze-combo.webp",
    "/assets/images/2026/06/PharmaTHC-THCa-Diamond-Infused-and-Live-Resin-Halo-Spark-Disposable-Vape-Purple-Punch-box-front.webp",
    "/assets/images/2026/07/wnc.webp"
  ],
  "741663": [
    "/assets/images/2026/06/WNC-2-gram-THCa-Live-Resin-Disposable-Papaya-Bomb-combo.webp",
    "/assets/images/2026/06/PharmaTHC-THCa-Diamond-Infused-and-Live-Resin-Halo-Spark-Disposable-Vape-Purple-Punch-box-front.webp",
    "/assets/images/2026/07/wnc.webp"
  ],
  "743849": [
    "/assets/images/2026/07/PharmaTHC-THCa-Diamonds-combo.webp",
    "/assets/images/2025/02/PharmaTHC-THCa-Crumble-Blueberry-Muffin-2-grams-combo-scaled.webp",
    "/assets/images/2024/04/CannaBuddy-THCa-Crumble-Trainwreck-1-gram-Jar-Front.webp"
  ],
  "744691": [
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-jar.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-product.webp"
  ],
  "744697": [
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousycombo.webp",
    "/assets/images/2026/07/THCa-Flower-Dogwalker-Pre-Rolls-Jealousy-product.webp",
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-.webp"
  ],
  "746827": [
    "/assets/images/2025/12/Pure-Roots-Botanicals-THC-Live-Rosin-Gummies-Variety-4-Pack-combo.webp",
    "/assets/images/2025/09/Camino-Sours-Delta-9-THC-and-CBD-Balance-Gummies-Orchard-Peach-Combo.webp",
    "/assets/images/2025/01/Camino-Delta-9-Excite-Gummies-Wild-Cherry-100-mg-Delta-9-THC-Total-Combo.webp"
  ],
  "746940": [
    "/assets/images/2026/07/THCa-Flower-Blunt-Nerd-Runtz_Multiple.webp",
    "/assets/images/2026/07/THCa-Flower-Blunt-Red-Slushy_Multiple-Copy.webp",
    "/assets/images/2026/04/THCa-Flower-Dogwalker-Pre-Rolls-Nerd-Runtz-jar.webp"
  ],
  "746959": [
    "/assets/images/2026/07/THCa-Flower-Blunt-Red-Slushy_Multiple-Copy.webp",
    "/assets/images/2026/07/THCa-Flower-Blunt-Nerd-Runtz_Multiple.webp",
    "/assets/images/2026/07/THCa-Flower-Blunt-Uncle-Snoop_Single-Copy-2.webp"
  ],
  "746963": [
    "/assets/images/2026/07/THCa-Flower-Blunt-Nerd-Runtz_Multiple.webp",
    "/assets/images/2026/07/THCa-Flower-Blunt-Red-Slushy_Multiple-Copy.webp",
    "/assets/images/2026/07/THCa-Flower-Pre-Roll-Jealousy-preroll-combo.webp"
  ]
}

export default galleries
