"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function storeLeadAction(email) {
  try {
    await sql`
      INSERT INTO leads (email)
      VALUES (${email})
    `;
  } catch (error) {
    console.error("Error storing lead:", error);
    throw new Error("Failed to store lead");
  }
}

export async function getLeadAction(email) {
  try {
    const rows = await sql`
      SELECT * FROM leads WHERE email = ${email}
    `;
    return rows[0];
  } catch (error) {
    console.error("Error fetching lead:", error);
    throw new Error("Failed to fetch lead");
  }
}
