"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ShareProductModal from "@/components/cta/share-product-modal";

export default function ShopProductsShareHandler({ products = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createdSlug = searchParams.get("created");

  const [modalOpen, setModalOpen] = useState(false);
  const [productToShare, setProductToShare] = useState(null);

  useEffect(() => {
    if (createdSlug) {
      // Find product in fetched products list if available
      const matched = products?.find(
        (p) =>
          p.product_slug === createdSlug ||
          p.slug === createdSlug ||
          String(p.product_id) === String(createdSlug),
      );

      if (matched) {
        setProductToShare({
          id: matched.product_id,
          name: matched.product_name || matched.name,
          price: matched.price,
          slug: matched.product_slug || matched.slug,
          image: matched.images?.[0] || null,
        });
      } else {
        // Fallback using query parameters
        setProductToShare({
          id: createdSlug,
          name: searchParams.get("name") || "Your Product",
          price: searchParams.get("price") || null,
          slug: createdSlug,
          image: searchParams.get("image") || null,
        });
      }
      setModalOpen(true);
    } else {
      setModalOpen(false);
      setProductToShare(null);
    }
  }, [createdSlug, products, searchParams]);

  function handleOpenChange(open) {
    setModalOpen(open);
    if (!open) {
      // Clean query parameters from URL without causing a full page refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      params.delete("name");
      params.delete("price");
      params.delete("image");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }

  if (!productToShare) return null;

  return (
    <ShareProductModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      product={productToShare}
    />
  );
}
