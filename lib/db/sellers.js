import { getUserByEmail } from "./users";
import { createClient } from "@/utils/supabase/server";

export async function createSeller(userEmail, shopDetails) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({ is_seller: true })
    .eq("email", userEmail)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }

  await newShopDetails(data.id, shopDetails);
}

export async function newShopDetails(userId, shopDetails) {
  const supabase = await createClient();

  const { error } = await supabase.from("sellers").insert([
    {
      user_id: userId,
      shop_name: shopDetails.name,
      shop_description: shopDetails.description,
      shop_logo: shopDetails.logo,
      shop_banner: shopDetails.banner,
      shop_slug: shopDetails.slug,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function updateShopDetails(email, shopDetails) {
  const user = await getUserByEmail(email);
  const userId = user[0].id;

  const supabase = await createClient();
  const { error } = await supabase
    .from("sellers")
    .update({
      shop_name: shopDetails.name,
      shop_description: shopDetails.description,
      shop_slug: shopDetails.slug,
      shop_logo: shopDetails.logo,
      shop_banner: shopDetails.banner,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function verifySeller(email) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("is_seller")
    .eq("email", email);

  if (error) {
    console.error(error);
    throw new Error("Unable to verify seller. Try again!");
  }

  return data;
}

export async function getShopDetails(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_shop_details", {
    p_email: email,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the shop details. Try again later!");
  }

  return data[0];
}

export async function getShopProducts(email) {
  const { id: sellerId } = await getShopDetails(email);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_shop_products", {
    p_seller_id: sellerId,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the products. Try again later!");
  }

  return data;
}

export async function getShopBySlug(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("shop_slug", slug)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the shop. Try again later!");
  }

  return data;
}

export async function getShopProductsBySlug(shopSlug) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_shop_products_by_slug", {
    p_shop_slug: shopSlug,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the products. Try again later!");
  }

  return data;
}

export async function createSellerOrders(sellerId, orderId) {
  const supabase = await createClient();

  const { error } = await supabase.from("seller_orders").insert([
    {
      seller_id: sellerId,
      order_id: orderId,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Error creating the seller order. Try again later!");
  }
}

export async function createPayouts(sellerId, amount) {
  const supabase = await createClient();

  const { error } = await supabase.from("payouts").insert([
    {
      seller_id: sellerId,
      amount: amount,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Error creating the payout. Try again later!");
  }
}

export async function getSellerOrders(userEmail) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_seller_orders", {
    p_user_email: userEmail,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the seller orders. Try again later!");
  }

  return data;
}

export async function createSellerBankDetails(bankDetails) {
  const supabase = await createClient();

  const { error } = await supabase.from("seller_bank_details").insert([
    {
      seller_id: bankDetails.sellerId,
      account_holder_name: bankDetails.accountHolderName,
      account_number: bankDetails.accountNumber,
      ifsc_code: bankDetails.ifscCode,
      phone: bankDetails.phone,
      verification_status: bankDetails.verificationStatus,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Error creating the seller bank details. Try again later!");
  }
}

export async function updateSellerBankDetails(bankDetails) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("seller_bank_details")
    .update({
      account_holder_name: bankDetails.accountHolderName,
      account_number: bankDetails.accountNumber,
      ifsc_code: bankDetails.ifscCode,
      phone: bankDetails.phone,
      verification_status: bankDetails.verificationStatus,
    })
    .eq("seller_id", bankDetails.sellerId);

  if (error) {
    console.error(error);
    throw new Error("Error updating the seller bank details. Try again later!");
  }
}

export async function getSellerBankDetails(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_seller_bank_details", {
    p_email: email,
  });

  if (error) {
    console.error(error);
    throw new Error(
      "Error retrieving the seller bank details. Try again later!",
    );
  }

  return data[0];
}

// Order details
export async function getBuyerDetails(orderId, itemId) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_buyer_details", {
    p_order_id: orderId,
    p_item_id: itemId,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the buyer details. Try again later!");
  }

  return data[0];
}

export async function getSellerDetails(orderItemId) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_seller_details", {
    p_order_item_id: orderItemId,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retrieving the seller details. Try again later!");
  }

  return data[0];
}
