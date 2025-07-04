export const heroBanners = [
  {
    id: 1,
    src: "/images/hero/e-books.png",
  },
  {
    id: 2,
    src: "/images/hero/digital-art-banner-comp.png",
  },
  {
    id: 3,
    src: "/images/hero/art-and-collectibles-banner.png",
  },
];

export const footerSections = [
  {
    // sectionName: "Support",
    sectionLinks: [
      { name: "About Us", link: "/about-us" },
      { name: "Contact Us", link: "/contact-us" },
      {
        name: `Sell on ${process.env.NEXT_PUBLIC_APP_NAME}`,
        link: "/your/shop/dashboard",
      },
    ],
  },
  {
    // sectionName: "Account",
    sectionLinks: [
      { name: "Blog", link: "/blog" },
      { name: "Cart", link: "/your/cart" },
      { name: "My Account", link: "/your/account" },
    ],
  },
  {
    // sectionName: "Policies",
    sectionLinks: [
      { name: "Privacy Policy", link: "/privacy-policy" },
      { name: "Terms and Conditions", link: "/terms-and-conditions" },
      {
        name: "Refunds and Returns Policy",
        link: "/refunds-and-returns-policy",
      },
    ],
  },
];

export const shopTabs = [
  { name: "Shop", link: "/your/shop/dashboard" },
  { name: "Products", link: "/your/shop/dashboard/products" },
  { name: "Payment", link: "/your/shop/dashboard/payment" },
  { name: "Orders", link: "/your/shop/dashboard/orders" },
];

export const accountTabs = [
  { name: "Profile", link: "/your/account" },
  { name: "Orders", link: "/your/account/orders" },
];
