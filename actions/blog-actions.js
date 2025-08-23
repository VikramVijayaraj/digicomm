"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function createPostAction(data) {
  const {
    title,
    description,
    category,
    slug,
    content,
    imageUrl,
    published_status,
  } = data;

  try {
    await sql`
      INSERT INTO blogposts (title, description, category, slug, content, cover_image, published_status)
      VALUES (${title}, ${description}, ${category}, ${slug}, ${content}, ${imageUrl}, ${published_status})
    `;

    // Revalidate both the blog page and sitemap
    revalidatePath("/blog");
    revalidatePath("/sitemap");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create post");
  }
}

export async function updatePostAction(data) {
  const {
    title,
    description,
    category,
    slug,
    content,
    imageUrl,
    published_status,
  } = data;

  try {
    // Create base query without cover_image
    let query = `
      UPDATE blogposts
      SET title = $1, 
          description = $2,
          category = $3, 
          slug = $4, 
          content = $5, 
          published_status = $6
    `;

    // Add cover_image to query only if imageUrl exists
    if (imageUrl) {
      query += `, cover_image = $7`;
    }

    query += ` WHERE slug = $4`;

    // Create params array based on whether imageUrl exists
    const params = imageUrl
      ? [
          title,
          description,
          category,
          slug,
          content,
          published_status,
          imageUrl,
        ]
      : [title, description, category, slug, content, published_status];

    await sql.query(query, params);

    revalidatePath("/blog");
    revalidatePath("/sitemap");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update post");
  }
}

export async function togglePostStatusAction(postId, status) {
  try {
    await sql`
      UPDATE blogposts
      SET published_status = ${status}
      WHERE id = ${postId}
    `;

    revalidatePath("/blog");
    revalidatePath("/sitemap");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to toggle post status");
  }
}
