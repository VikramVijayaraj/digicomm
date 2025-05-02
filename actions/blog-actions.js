"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function createPostAction(data) {
  const { title, category, slug, content, imageUrl, published_status } = data;

  try {
    await sql`
      INSERT INTO blogposts (title, category, slug, content, cover_image, published_status)
      VALUES (${title}, ${category}, ${slug}, ${content}, ${imageUrl}, ${published_status})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create post");
  }
}
