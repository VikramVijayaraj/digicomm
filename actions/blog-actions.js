"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { formatFileName } from "@/utils/utils";

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

  const { error } = await supabaseAdmin.from("blogposts").insert([
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
    slug,
    content,
    imageUrl,
    published_status,
  } = data;

  const newSlug = slug.trim();
  const oldSlug = currentSlug.trim();

  const updateData = {
    title: title,
    description: description,
    category: category,
    slug: newSlug,
    content: content,
    published_status: published_status,
  };

  if (imageUrl) {
    updateData.cover_image = imageUrl;
  }

  try {
    // Add .select() to get the updated data
    const { data: updatedData, error } = await supabaseAdmin
      .from("blogposts")
      .update(updateData)
      .eq("slug", oldSlug)
      .select(); // This returns the updated rows

    if (error) {
      console.error("Supabase Update Error:", error);
      throw new Error("Failed to update post due to a database error.");
    }

    // Check if any rows were updated
    if (!updatedData || updatedData.length === 0) {
      console.warn(`No post found with slug: "${oldSlug}"`);
      throw new Error("No post found with the provided slug.");
    }

    console.log("Post updated successfully:", updatedData[0]);

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/blog/${newSlug}`);
    if (oldSlug !== newSlug) {
      revalidatePath(`/blog/${oldSlug}`);
    }
    revalidatePath("/sitemap");
  } catch (error) {
    console.error("Database Action Error:", error);
    throw new Error("Failed to update post.");
  }
}

export async function togglePostStatusAction(postId, status) {
  const { error } = await supabaseAdmin
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

export async function uploadBlogImageAction(formData) {
  const file = formData.get("file");

  if (!file) {
    throw new Error("No file provided");
  }

  // 1. Create unique name
  const formatedFileName = formatFileName(file.name);
  const fileName = `blog-images/${formatedFileName}`;

  // 2. Upload using Admin client (Securely on server)
  const { error } = await supabaseAdmin.storage
    .from("public-assets")
    .upload(fileName, file, {
      upsert: false,
    });

  if (error) {
    console.error("Server upload error:", error);
    throw new Error("Upload failed");
  }

  // 3. Get Public URL
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("public-assets").getPublicUrl(fileName);

  return publicUrl;
}
