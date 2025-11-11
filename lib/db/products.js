import { createClient } from "@/utils/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_products");

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch products!");
  }

  return data;
}

export async function getProduct(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_product", { p_slug: slug });

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch product!");
  }

  if (!data || data.length === 0) {
    return null; // Product not found
  }

  return data[0];
}

export async function getProductsByCategory(categorySlug) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_products_by_category", {
    p_category_slug: categorySlug,
  });

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch products by category!");
  }

  return data;
}

export async function getFilteredProducts(searchTerm) {
  const formattedSearchTerm = searchTerm?.split(" ").join(" & ");

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_filtered_products", {
    p_search_term: formattedSearchTerm,
  });

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch products!");
  }

  return data;
}

export async function getSearchSuggestions(searchTerm) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_search_suggestions", {
    p_search_term: searchTerm,
  });

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch products!");
  }

  return data;
}

export async function addProduct(productDetails) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: productDetails.name,
        description: productDetails.description,
        price: productDetails.price,
        category_id: productDetails.category,
        seller_id: productDetails.seller,
        slug: productDetails.slug,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error while adding the product. Try again later!");
  }

  return data;
}

export async function addProductImage(productId, image) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .insert([
      {
        product_id: productId,
        image_url: image,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error while adding the product image. Try again later!");
  }
}

export async function addProductFile(productId, file) {
  const supabase = await createClient();

  const { error } = await supabase.from("product_files").insert([
    {
      product_id: productId,
      file_url: file,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Error while adding the product file. Try again later!");
  }
}

export async function updateProduct(productId, productDetails) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: productDetails.name,
      description: productDetails.description,
      category_id: productDetails.category,
      slug: productDetails.slug,
      price: productDetails.price,
    })
    .eq("id", productId);

  if (error) {
    console.error(error);
    throw new Error("Error while updating the product. Try again later!");
  }
}

export async function deleteProduct(productId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error(error);
    throw new Error("Error while deleting the product. Try again later!");
  }
}

export async function deleteProductImage(imageUrl) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("image_url", imageUrl);

  if (error) {
    console.error(error);
    throw new Error("Cannot delete image!");
  }
}

export async function deleteProductFile(fileUrl) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_files")
    .delete()
    .eq("file_url", fileUrl);

  if (error) {
    console.error(error);
    throw new Error("Cannot delete file!");
  }
}

export async function updateProductStock(productId, quantity) {
  const { error } = await supabase.rpc("update_product_stock", {
    p_product_id: productId,
    p_quantity: quantity,
  });

  if (error) {
    console.error(error);
    throw new Error("Error while updating stock. Try again later!");
  }
}

export async function getLatestProductsByCategory(categoryId, limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        price,
        description,
        category_id,
        created_at,
        slug,
        seller_id,
        categories (name, slug),
        product_images (id, image_url)
      `,
    )
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch latest products by category!");
  }

  return data;
}
