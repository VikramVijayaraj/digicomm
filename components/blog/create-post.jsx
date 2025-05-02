"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import slugify from "slugify";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { uploadToFirebase } from "@/utils/firebase";
import { createPostAction } from "@/actions/blog-actions";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
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

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Upload the file to Firebase and get the URL
    const imageUrl = await uploadToFirebase(file, "blog-images");

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    const post = {
      title,
      category,
      slug,
      content,
      imageUrl,
      published_status: true,
    };
    await createPostAction(post);

    toast.success("Post created successfully!");

    // Reset the form
    setTitle("");
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
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
      <Button disabled={isSubmitting} type="submit" className="mt-20 md:mt-10">
        {isSubmitting ? "Publishing..." : "Publish"}
      </Button>
    </form>
  );
}
