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

export async function updatePostAction(data, currentSlug) {
  const {
    title,
    description,
    category,
    slug, // This is the new slug
    content,
    imageUrl,
    published_status,
  } = data;

  // For safety, trim both slugs to avoid whitespace issues
  const newSlug = slug.trim();
  const oldSlug = currentSlug.trim();

  try {
    let result;

    if (imageUrl) {
      // Query runs if an image is provided
      result = await sql`
        UPDATE blogposts
        SET title = ${title},
            description = ${description},
            category = ${category},
            slug = ${newSlug},
            content = ${content},
            published_status = ${published_status},
            cover_image = ${imageUrl}
        WHERE slug = ${oldSlug}
      `;
    } else {
      // Query runs if no image is provided
      result = await sql`
        UPDATE blogposts
        SET title = ${title},
            description = ${description},
            category = ${category},
            slug = ${newSlug},
            content = ${content},
            published_status = ${published_status}
        WHERE slug = ${oldSlug}
      `;
    }

    if (result.rowCount === 0) {
      console.warn(
        "Update failed: The original slug was not found in the database.",
      );
    }

    revalidatePath("/blog");
    revalidatePath("/sitemap");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update post.");
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
