"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  deleteProductFilesAction,
  deleteProductImageAction,
  updateProductAction,
} from "@/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import { formatFileName, optimizeImage } from "@/utils/utils";

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
      // stock: parseInt(productData?.stock) || 0,
      price: parseInt(productData?.price) || 0,
      files: productData?.files || [],
      isDigital: productData?.isDigital || false,
    },
  });

  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState(productData?.images);
  const [files, setFiles] = useState([]);
  const [productFiles, setProductFiles] = useState([]);
  const supabase = createClient();

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

  // Function to handle product file uploads
  function handleFileChange(e) {
    const files = e.target.files;
    setProductFiles(files);
    form.setValue("files", files); // Update the form value for files
  }

  // Upload To Supabase Storage
  async function handleUpload(files, folder, bucket, optimize = true) {
    if (!files || files.length === 0) return [];
    const uploadedUrls = [];

    for (const file of files) {
      try {
        // 1. Determine file and extension logic
        const fileToUpload = optimize
          ? await optimizeImage(file, "productImage")
          : file;

        // FIX: Only force "webp" if we actually optimized the image.
        // Otherwise, pass undefined/null to keep the original extension (jpg, pdf, etc.)
        const extensionOverride = optimize ? "webp" : undefined;

        const fileName = formatFileName(file.name, extensionOverride);
        const storagePath = `${folder}/${fileName}`;

        // 2. Determine correct Content-Type
        // If optimized, it's definitely webp. If not, use original file type.
        const contentType = optimize ? "image/webp" : file.type;

        // 3. Upload to Supabase
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, fileToUpload, {
            contentType: contentType, // Helps browser display/download correctly
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading the file", uploadError);
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(storagePath);

        console.log(`${fileToUpload.name} uploaded successfully`);
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error(`Error processing or uploading ${file.name}: `, error);
        throw new Error(error.message);
      }
    }
    return uploadedUrls;
  }

  async function onSubmit(data) {
    let productId;

    if (productData) {
      // We already have product ID for edit mode
      productId = productData.product_id;
    } else {
      // 1. Create the product first (without images/files)
      const id = await addProductAction(session?.user?.email, {
        ...data,
        images: [],
        files: [],
      });
      productId = id;
    }

    // 2. Upload Images and Files using productId as folder
    const uploadedImages = await handleUpload(
      files,
      `product-images/${productId}`,
      "public-assets",
    );
    const uploadedFiles = await handleUpload(
      productFiles,
      productId,
      "product-files",
      false,
    );

    // 3. Update the product with file URLs
    const updatePayload = {
      ...data,
      images: uploadedImages,
      files: uploadedFiles,
    };

    if (productData) {
      // Delete old images and files if new ones are uploaded
      if (uploadedImages.length > 0) {
        for (let image of productData.images) {
          // Remove from Supabase storage
          const imagePath = decodeURIComponent(
            image.split("/public-assets/")[1],
          ); // Extract image path

          const { error } = await supabase.storage
            .from("public-assets")
            .remove([imagePath]);

          if (error) {
            console.error("Error deleting image from storage: ", error);
          } else {
            console.log("Deleted successfully from Supabase:", imagePath);
          }

          await deleteProductImageAction(image);
        }
      }
      if (uploadedFiles.length > 0) {
        for (let file of productData.files) {
          const filePath = decodeURIComponent(file.split("/product-files/")[1]);

          const { error } = await supabase.storage
            .from("product-files")
            .remove([filePath]);

          if (error) {
            console.error("Error deleting image from storage: ", error);
          } else {
            console.log("Deleted successfully from Supabase:", filePath);
          }

          await deleteProductFilesAction(file);
        }
      }

      // On Edit mode
      await updateProductAction(productId, updatePayload);
    } else {
      // Update newly created product
      await updateProductAction(productId, updatePayload);
    }

    router.push("/your/shop/dashboard/products");
    productData
      ? toast.success("Product Updated Successfully.")
      : toast.success("Product Added Successfully.");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between md:px-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-8"
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
                  This is the name of your product
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
                  Provide a brief description of the product
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

          {/* Digital Product Checkbox */}
          {/* <FormField
            control={form.control}
            name="isDigital"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Digital Product</FormLabel>
                  <FormDescription>
                    Check this if you are selling a digital product
                  </FormDescription>
                </div>
              </FormItem>
            )}
          /> */}

          {/* Files Upload */}
          {/* {form.watch("isDigital") && (
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Product Files</FormLabel>
                  <FormControl>
                    <Input type="file" multiple onChange={handleFileChange} />
                  </FormControl>
                  <FormDescription>Actual files of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          {/* <div className="flex justify-between gap-4"> */}
          {/* Stock */}
          {/* <div className="w-1/2">
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
                      Indicate how many units of the product are available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

          {/* Price */}
          <div className="">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormDescription>Enter price in INR</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* </div> */}

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
                {productData?.images ? (
                  <FormDescription>
                    Only upload images if you want to replace the previously
                    uploaded ones
                  </FormDescription>
                ) : (
                  <FormDescription>
                    Images that are shown to customer
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Previews */}
          <NewProductPreviews images={imagePreviews} />

          {/* Files Upload for Digital Products */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Files</FormLabel>
                <FormControl>
                  <Input type="file" multiple onChange={handleFileChange} />
                </FormControl>
                {productData?.files ? (
                  <FormDescription>
                    Only upload files if you want to replace the previously
                    uploaded ones
                  </FormDescription>
                ) : (
                  <FormDescription>
                    Upload the actual product files
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            {/* Submit Button */}
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>

            {/* Cancel Button */}
            <Button
              disabled={form.formState.isSubmitting}
              onClick={() => router.back()}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
