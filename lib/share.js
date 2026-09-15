export function getShareLinks({ productUrl, title }) {
  const encodedUrl = encodeURIComponent(productUrl);
  const text = encodeURIComponent(`Check out "${title}" on Crelands!`);

  return {
    instagram: "https://www.instagram.com/",
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    copy: productUrl,
  };
}
