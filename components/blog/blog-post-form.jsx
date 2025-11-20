"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createPostAction, updatePostAction } from "@/actions/blog-actions";
import { formatFileName, optimizeImage } from "@/utils/utils";
import { createClient } from "@/utils/supabase/client";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function BlogPostForm({
  currentTitle,
  currentDescription,
  currentCategory,
  currentContent,
  currentImage,
  currentSlug,
}) {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [category, setCategory] = useState(currentCategory || "");
  const [content, setContent] = useState(currentContent || "");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Handle file upload
  function handleFile(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    setIsSubmitting(true);
    e.preventDefault();

    let imageUrl;
    if (file) {
      const optimizedFile = await optimizeImage(file, "blogImage");
      const fileName = formatFileName(file.name, "webp");

      const { error: uploadError } = await supabase.storage
        .from("public-assets")
        .upload(`blog-images/${fileName}`, optimizedFile, {
          contentType: "image/webp", // Explicitly set content type for Supabase
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast.error("Failed to upload image.");
        setIsSubmitting(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("public-assets")
        .getPublicUrl(`blog-images/${fileName}`);
      imageUrl = publicUrl;
    }

    // If new image is uploaded, delete the old one from storage
    if (imageUrl && currentImage && currentImage !== imageUrl) {
      const imagePath = decodeURIComponent(
        currentImage.split("/public-assets/")[1],
      );

      const { error } = await supabase.storage
        .from("public-assets")
        .remove([imagePath]);

      if (error) {
        console.error("Error deleting image from storage: ", error);
      } else {
        console.log("Deleted successfully from Supabase:", imagePath);
      }
    }

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    const post = {
      title,
      description,
      category,
      slug,
      content: content.getHTML(),
      imageUrl,
      published_status: true,
    };

    // Only send new data, not old "current" values
    if (currentTitle) {
      await updatePostAction(post, currentSlug);
      toast.success("Post updated successfully!");
      router.push("/admin/blog");
    } else {
      await createPostAction(post);
      toast.success("Post created successfully!");
      router.push("/admin/blog");
    }

    // Reset the form
    setTitle("");
    setDescription("");
    setCategory("");
    setFile("");
    setContent("");
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full mx-auto"
    >
      <Input
        type="text"
        placeholder="SEO Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="SEO Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Input type="file" accept="image/*" onChange={handleFile} />

      {/* Text Editor */}
      <SimpleEditor action={setContent} dbContent={content} />

      {/* Publish button */}
      <div>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="mt-20 md:mt-10 px-32"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}
