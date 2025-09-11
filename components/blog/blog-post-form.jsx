"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import slugify from "slugify";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import deleteFromFirebase, { uploadToFirebase } from "@/utils/firebase";
import { createPostAction, updatePostAction } from "@/actions/blog-actions";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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

    const imageUrl = await uploadToFirebase(file, "blog-images");

    // If new image is uploaded, delete the old one from Firebase
    if (imageUrl && currentImage !== imageUrl) {
      await deleteFromFirebase(currentImage);
    }

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    const post = {
      title,
      description,
      category,
      slug,
      content,
      imageUrl,
      published_status: true,
    };

    // Check if currentTitle is provided and if true then update the post
    if (currentTitle) {
      await updatePostAction(
        {
          ...post,
          currentTitle,
          currentDescription,
          currentCategory,
          currentContent,
        },
        currentSlug,
      );
      toast.success("Post updated successfully!");
      router.replace("/admin/blog");
    } else {
      await createPostAction(post);
      toast.success("Post created successfully!");
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
      <ReactQuill
        theme="snow"
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
        className="h-[500px]"
      />

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
