"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { NewProductPreviews } from "./new-product/new-product-previews";
import { productSchema } from "@/lib/schema";
import {
  addProductAction,
  deleteProductImageAction,
  updateProductAction,
} from "@/actions/product-actions";
import deleteFromFirebase from "@/utils/firebase";

export default function ProductDetailsForm({
  session,
  categories,
  productData,
}) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: productData?.product_name || "",
      description: productData?.product_desc || "",
      category: "",
      images: productData?.images || [],
      stock: parseInt(productData?.stock) || 0,
      price: parseInt(productData?.price) || 0,
    },
  });

  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState(productData?.images);
  const [files, setFiles] = useState([]);

  // Function to handle image previews
  function handleImageChange(e) {
    const files = e.target.files;
    setFiles(files);

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
  }

  // Upload Images To Firebase
  async function handleUpload() {
    if (!files) return; // Return if no file is selected

    const imageUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `product-images/${file.name + uuid()}`); // Create a reference to the file in Firebase Storage

      try {
        await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
        const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
        console.log(`${file.name} Uploaded Successfully`);
        imageUrls.push(url);
      } catch (error) {
        console.error(`Error uploading the ${file.name}: `, error);
        throw new Error();
      }
    }
    return imageUrls;
  }

  async function onSubmit(data) {
    const uploadedImages = await handleUpload();

    data["images"] = [...uploadedImages];

    if (productData) {
      // Delete old images from firebase only if new images are uploaded
      if (uploadedImages.length > 0) {
        for (let image of productData.images) {
          await deleteFromFirebase(`product-images/${image}`);
          await deleteProductImageAction(image);
        }
      }
      
      await updateProductAction(productData.product_id, data);
    } else {
      await addProductAction(session?.user?.email, data);
    }

    router.back();
    productData
      ? toast.success("Product Updated Successfully.")
      : toast.success("Product Added Successfully.");
  }

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
            name="name"
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
                        <SelectItem key={category.id} value={category.id}>
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
          <NewProductPreviews images={imagePreviews} />

          {/* Submit Button */}
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
