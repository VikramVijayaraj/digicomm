import { createClient } from "@/utils/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch users!");
  }

  return data;
}

export async function getUserByEmail(email) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch user by email!");
  }

  return data;
}

export async function createUser(userDetails) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password,
      },
    ])
    .select("id, username, email")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error creating the user. Please try again later!");
  }

  return data;
}

export async function updateUserDetails(userDetails) {
  const supabase = await createClient();

  // Update into users table
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
    })
    .eq("email", userDetails.email)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error updating your data. Please try again later!");
  }

  const userId = data.id;

  // Update/Insert into address table
  const { error: addressError } = await supabase.from("addresses").upsert(
    {
      user_id: userId,
      address_line1: userDetails.addressLine1,
      address_line2: userDetails.addressLine2,
      city: userDetails.city,
      state: userDetails.state,
      zip_code: userDetails.zipCode,
      country: userDetails.country,
      phone: userDetails.phone,
    },
    { onConflict: "user_id" },
  );

  if (addressError) {
    console.error(addressError);
    throw new Error("Error updating your data. Please try again later!");
  }
}

export async function getUserDetailsByEmail(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_details_by_email", {
    p_email: email,
  });

  if (error) {
    console.error(error);
    throw new Error("Cannot fetch user details by email!");
  }

  return data;
}

export async function createUserSource(email, source) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ source: source })
    .eq("email", email);

  if (error) {
    console.error(error);
    throw new Error("Error updating the user source. Please try again later!");
  }
}

export async function getUserSourceByEmail(email) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("source")
    .eq("email", email)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error fetching user source. Please try again later!");
  }

  return data?.source || null;
}
