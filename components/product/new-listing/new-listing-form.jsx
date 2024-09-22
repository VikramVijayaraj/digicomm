"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NewListingPreviews } from "./new-listing-previews";

const productSchema = z.object({
  productName: z.string().min(2, { message: "Product name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  images: z.any().refine((files) => files && files.length > 0, {
    message: "At least one image is required",
  }),
  stock: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
    z
      .number({ invalid_type_error: "Stock must be a number" })
      .min(1, { message: "Stock must be at least 1" }), // Custom message for stock less than 1
  ),
  price: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
    z
      .number({ invalid_type_error: "Price must be a number" })
      .min(1, { message: "Price must be at least 1 rupee" }), // Custom message for price
  ),
});

export default function NewListingForm({ categories }) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      category: "",
      images: [],
      stock: 0,
      price: 0,
    },
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Function to handle image previews
  const handleImageChange = (e) => {
    const files = e.target.files;
    const previewArray = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewArray.push(reader.result);
        if (previewArray.length === files.length) {
          setImagePreviews(previewArray); // Set previews once all files are processed
        }
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
    form.setValue("images", files); // Update the form value for images
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          {/* Product Name */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category (Dropdown Select) */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            {/* Stock */}
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter total stock"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Indicate how many units of the product are available.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Price */}
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter price in INR.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Images Upload */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Product Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Previews */}
          <NewListingPreviews images={imagePreviews} />

          {/* Submit Button */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
