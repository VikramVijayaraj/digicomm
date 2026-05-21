"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileUp,
  FolderOpen,
  ImagePlus,
  IndianRupee,
  Package,
  PenSquare,
  Tag,
} from "lucide-react";

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

function FieldShell({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-4 flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function UploadField({
  id,
  title,
  description,
  buttonLabel,
  fileSummary,
  accept,
  multiple = false,
  onChange,
}) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4">
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />

      <label htmlFor={id} className="block cursor-pointer">
        <div className="rounded-[1rem] border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
            <div className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white">
              {buttonLabel}
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {fileSummary}
          </p>
        </div>
      </label>
    </div>
  );
}

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
      price: parseInt(productData?.price) || 0,
      files: productData?.files || [],
      isDigital: productData?.isDigital || false,
    },
  });

  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState(productData?.images || []);
  const [files, setFiles] = useState([]);
  const [productFiles, setProductFiles] = useState([]);
  const supabase = createClient();

  const imageSummary = useMemo(() => {
    if (files?.length > 0) {
      return `${files.length} image${files.length > 1 ? "s" : ""} selected`;
    }

    if (productData?.images?.length > 0) {
      return `${productData.images.length} existing image${
        productData.images.length > 1 ? "s" : ""
      } attached`;
    }

    return "No images selected yet";
  }, [files, productData?.images]);

  const productFileSummary = useMemo(() => {
    if (productFiles?.length > 0) {
      return `${productFiles.length} file${productFiles.length > 1 ? "s" : ""} selected`;
    }

    if (productData?.files?.length > 0) {
      return `${productData.files.length} existing file${
        productData.files.length > 1 ? "s" : ""
      } attached`;
    }

    return "No product files selected yet";
  }, [productFiles, productData?.files]);

  function handleImageChange(e) {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    const previewArray = [];
    for (const file of selectedFiles) {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewArray.push(reader.result);
        if (previewArray.length === selectedFiles.length) {
          setImagePreviews(previewArray);
        }
      };
      reader.readAsDataURL(file);
    }
    form.setValue("images", selectedFiles);
  }

  function handleFileChange(e) {
    const selectedFiles = e.target.files;
    setProductFiles(selectedFiles);
    form.setValue("files", selectedFiles);
  }

  async function handleUpload(filesToUpload, folder, bucket, optimize = true) {
    if (!filesToUpload || filesToUpload.length === 0) return [];
    const uploadedUrls = [];

    for (const file of filesToUpload) {
      try {
        const fileToUpload = optimize
          ? await optimizeImage(file, "productImage")
          : file;

        const extensionOverride = optimize ? "webp" : undefined;
        const fileName = formatFileName(file.name, extensionOverride);
        const storagePath = `${folder}/${fileName}`;
        const contentType = optimize ? "image/webp" : file.type;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, fileToUpload, {
            contentType,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(storagePath);

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
      productId = productData.product_id;
    } else {
      const id = await addProductAction(session?.user?.email, {
        ...data,
        images: [],
        files: [],
      });
      productId = id;
    }

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

    const updatePayload = {
      ...data,
      images: uploadedImages,
      files: uploadedFiles,
    };

    if (productData) {
      if (uploadedImages.length > 0) {
        for (let image of productData.images) {
          const imagePath = decodeURIComponent(
            image.split("/public-assets/")[1],
          );

          const { error } = await supabase.storage
            .from("public-assets")
            .remove([imagePath]);

          if (error) {
            console.error("Error deleting image from storage: ", error);
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
            console.error("Error deleting file from storage: ", error);
          }

          await deleteProductFilesAction(file);
        }
      }

      await updateProductAction(productId, updatePayload);
    } else {
      await updateProductAction(productId, updatePayload);
    }

    router.push("/your/shop/dashboard/products");
    productData
      ? toast.success("Product Updated Successfully.")
      : toast.success("Product Added Successfully.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_340px] lg:items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldShell
            icon={PenSquare}
            title="Core details"
            description="Start with the basic buyer-facing information that defines the product."
          >
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500">
                      This is the main title buyers will see first.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what the buyer gets, how it can be used, and why it is valuable."
                        className="min-h-40 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500">
                      Keep it clear, specific, and easy to scan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldShell>

          <FieldShell
            icon={Tag}
            title="Category and pricing"
            description="Help buyers understand where this product belongs and what it costs."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-200">
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

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Price
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="Enter price"
                          className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-base shadow-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500">
                      Enter the selling price in INR.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldShell>

          <FieldShell
            icon={ImagePlus}
            title="Product visuals"
            description="Upload polished visuals so buyers can quickly understand the product before purchase."
          >
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Product Images
                  </FormLabel>
                  <FormControl>
                    <UploadField
                      id="product-images-upload"
                      title="Upload product images"
                      description={
                        productData?.images
                          ? "Choose new images only if you want to replace the existing set."
                          : "Use strong cover visuals that will look good in collections and on the product page."
                      }
                      buttonLabel="Upload"
                      fileSummary={imageSummary}
                      accept="image/*"
                      multiple={true}
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-5">
              <NewProductPreviews images={imagePreviews} />
            </div>
          </FieldShell>

          <FieldShell
            icon={FolderOpen}
            title="Delivery files"
            description="Upload the actual files buyers receive after checkout."
          >
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Product Files
                  </FormLabel>
                  <FormControl>
                    <UploadField
                      id="product-files-upload"
                      title="Upload digital product files"
                      description={
                        productData?.files
                          ? "Select new files only if you want to replace the files already attached."
                          : "Add the PDFs, ZIPs, templates, audio packs, or other files customers will download."
                      }
                      buttonLabel="Upload"
                      fileSummary={productFileSummary}
                      multiple={true}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldShell>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              disabled={form.formState.isSubmitting}
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="h-12 rounded-full border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Package className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-950">
            Listing checklist
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>1. Use a clear, specific product name.</p>
            <p>2. Write a description that explains the buyer outcome.</p>
            <p>3. Upload polished cover visuals.</p>
            <p>4. Add the final downloadable files buyers should receive.</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,248,242,1)_0%,rgba(255,255,255,1)_100%)] p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <FileUp className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-950">
            Better uploads perform better
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Catchy thumbnails, useful file names, and a clear description make
            the listing easier to trust and easier to buy.
          </p>
        </div>
      </aside>
    </div>
  );
}
