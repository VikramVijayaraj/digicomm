"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";

export async function storeLeadAction(email) {
  const { error } = await supabaseAdmin.from("leads").insert({ email });

  if (error) {
    console.error("Error storing lead in Supabase:", error);
    throw new Error("Failed to store lead");
  }
}

export async function getLeadAction(email) {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching lead from Supabase:", error);
    throw new Error("Failed to fetch lead");
  }

  return data;
}
