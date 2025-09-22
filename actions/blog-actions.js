"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/utils/supabase/admin";

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

  const { data, error } = await supabaseAdmin.from("blogposts").insert([
    {
      title,
      description,
      category,
      slug,
      content,
      cover_image: imageUrl,
      published_status,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Failed to create post");
  }

  // Revalidate both the blog page and sitemap
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap");
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
      const { data, error } = await supabaseAdmin
        .from("blogposts")
        .update({
          title: title,
          description: description,
          category: category,
          slug: newSlug,
          content: content,
          published_status: published_status,
          cover_image: imageUrl,
        })
        .eq("slug", oldSlug);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error("Failed to update post.");
      }

      result = data;
    } else {
      // Query runs if no image is provided
      const { data, error } = await supabaseAdmin
        .from("blogposts")
        .update({
          title: title,
          description: description,
          category: category,
          slug: newSlug,
          content: content,
          published_status: published_status,
        })
        .eq("slug", oldSlug);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error("Failed to update post.");
      }

      result = data;
    }

    if (result.rowCount === 0) {
      console.warn(
        "Update failed: The original slug was not found in the database.",
      );
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${newSlug}`);
    revalidatePath("/sitemap");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update post.");
  }
}

export async function togglePostStatusAction(postId, status) {
  const { data, error } = await supabaseAdmin
    .from("blogposts")
    .update({
      published_status: status,
    })
    .eq("id", postId);

  if (error) {
    console.error(error);
    throw new Error("Failed to toggle post status");
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap");
}
