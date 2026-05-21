"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import slugify from "slugify";
import { ImagePlus, PenSquare, Store, Upload } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createSellerAction,
  updateSellerAction,
} from "@/actions/seller-actions";
import { shopSchema } from "@/lib/schema";
import { formatFileName, optimizeImage } from "@/utils/utils";
import { createClient } from "@/utils/supabase/client";

function UploadPanel({
  id,
  title,
  description,
  buttonLabel,
  onChange,
  summary,
}) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4">
      <input
        id={id}
        type="file"
        accept="image/*"
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
            <span className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white">
              <Upload className="mr-2 h-4 w-4" />
              {buttonLabel}
            </span>
          </div>
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {summary}
          </p>
        </div>
      </label>
    </div>
  );
}

export default function ShopDetailsForm({ session, data }) {
  // React Hook Form
  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      banner: "",
      logo: "",
      name: data?.shop_name || "",
      description: data?.shop_description || "",
    },
  });

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [banner, setBanner] = useState(data?.shop_banner);
  const [logo, setLogo] = useState(data?.shop_logo);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Banner Preview
  function handleBannerChange(e) {
    const image = e.target.files[0];
    if (image) {
      setBanner(URL.createObjectURL(image));
      setBannerFile(image);
    }
  }

  // Logo Preview
  function handleLogoChange(e) {
    const image = e.target.files[0];
    if (image) {
      setLogo(URL.createObjectURL(image));
      setLogoFile(image);
    }
  }

  // Upload Images To Storage
  async function uploadImage(file, path, fileType) {
    if (!file) return; // Return if no file is selected

    const optimizedFile = await optimizeImage(file, fileType);
    const fileName = formatFileName(file.name, "webp");
    try {
      const { error: uploadError } = await supabase.storage
        .from("public-assets")
        .upload(`${path}/${fileName}`, optimizedFile, {
          contentType: "image/webp",
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error("Failed to upload image");
      } else {
        console.log("File uploaded successfully:", file.name);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("public-assets")
        .getPublicUrl(`${path}/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Unexpected error uploading file:", error);
      throw error;
    }
  }

  async function onSubmit(values) {
    const slug = slugify(values.name, {
      lower: true,
      strict: true,
    });

    const shopData = {
      ...values,
      logo: data?.shop_logo || null,
      banner: data?.shop_banner || null,
      slug,
    };
    let sellerId;

    // Update shop details if data is available, otherwise create new.
    if (data) {
      sellerId = await updateSellerAction(session?.user?.email, shopData);
      toast.success("Shop details updated!");
      router.refresh();
    } else {
      sellerId = await createSellerAction(session?.user?.email, shopData);
      toast.success("Shop created successfully!");
    }

    const logoUrl = await uploadImage(
      logoFile,
      `shop-images/${sellerId}`,
      "shopLogo",
    );
    const bannerUrl = await uploadImage(
      bannerFile,
      `shop-images/${sellerId}`,
      "shopBanner",
    );

    const updatedData = {
      ...shopData,
      logo: logoUrl || data?.shop_logo,
      banner: bannerUrl || data?.shop_banner,
    };

    await updateSellerAction(session?.user?.email, updatedData);

    // Delete old files from storage if new ones were uploaded
    if (logoUrl && data?.shop_logo) {
      const currentImage = data?.shop_logo;
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
    if (bannerUrl && data?.shop_banner) {
      const currentImage = data?.shop_banner;
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

    // After registering the shop, user is redirected to dashboard.
    if (pathname === "/your/shop/register") {
      router.push("/your/shop/dashboard");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6"
        >
          <div className="border-b border-slate-200 pb-5">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <Store className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Storefront details
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These details are visible on your public shop page.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Shop Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter shop name"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-sm text-slate-500">
                  This is your public shop name.
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
                  Shop Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell buyers what you sell and what makes your shop useful."
                    className="min-h-36 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-sm text-slate-500">
                  Tell something about your shop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5">
            <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Shop visuals</h3>
                <p className="text-sm text-slate-500">
                  Upload a banner and logo for your storefront.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="banner"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Shop Banner
                  </FormLabel>
                  <FormControl>
                    <UploadPanel
                      id="shop-banner-upload"
                      title="Upload shop banner"
                      description="Use a wide visual that represents your shop across the storefront."
                      buttonLabel="Upload"
                      onChange={handleBannerChange}
                      summary={
                        bannerFile?.name ||
                        (data?.shop_banner
                          ? "Existing banner attached"
                          : "No banner selected yet")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Shop Logo
                  </FormLabel>
                  <FormControl>
                    <UploadPanel
                      id="shop-logo-upload"
                      title="Upload shop logo"
                      description="Use a clear square logo or avatar that works at small sizes."
                      buttonLabel="Upload"
                      onChange={handleLogoChange}
                      summary={
                        logoFile?.name ||
                        (data?.shop_logo
                          ? "Existing logo attached"
                          : "No logo selected yet")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Shop Details"}
          </Button>
        </form>
      </Form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="relative h-40 bg-slate-100">
            {banner ? (
              <Image
                src={banner}
                alt="Shop Banner Preview"
                className="object-cover"
                fill
                unoptimized={true}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(245,248,255,1)_100%)] text-sm text-slate-500">
                Banner preview
              </div>
            )}
          </div>

          <div className="relative px-5 pb-5 pt-12">
            <div className="absolute -top-10 left-5 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-sm">
              {logo ? (
                <Image
                  src={logo}
                  alt="Shop Logo Preview"
                  className="object-cover"
                  fill
                  unoptimized={true}
                />
              ) : (
                <Image
                  className="object-cover"
                  src="/images/shop-avatar.png"
                  alt="Shop Avatar"
                  fill
                  unoptimized={true}
                />
              )}
            </div>

            <p className="line-clamp-1 text-lg font-semibold text-slate-950">
              {form.watch("name") || data?.shop_name || "Your shop name"}
            </p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {form.watch("description") ||
                data?.shop_description ||
                "Your shop description preview will appear here as you type."}
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <PenSquare className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-950">Profile checklist</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <p>Use a clear shop name buyers can remember.</p>
            <p>Add a banner that matches what you sell.</p>
            <p>Keep the description direct and buyer-focused.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
