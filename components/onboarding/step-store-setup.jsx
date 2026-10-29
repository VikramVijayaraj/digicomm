"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import {
  ArrowRight,
  ImagePlus,
  LoaderCircle,
  Store,
  Upload,
} from "lucide-react";

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

function UploadPanel({ id, title, description, buttonLabel, onChange, summary }) {
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
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

export default function StepStoreSetup({ session, onContinue }) {
  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      banner: "",
      logo: "",
      name: "",
      description: "",
    },
  });

  const supabase = createClient();
  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  function handleBannerChange(e) {
    const image = e.target.files[0];
    if (image) {
      setBanner(URL.createObjectURL(image));
      setBannerFile(image);
    }
  }

  function handleLogoChange(e) {
    const image = e.target.files[0];
    if (image) {
      setLogo(URL.createObjectURL(image));
      setLogoFile(image);
    }
  }

  async function uploadImage(file, path, fileType) {
    if (!file) return;

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
    try {
      const slug = slugify(values.name, {
        lower: true,
        strict: true,
      });

      const shopData = {
        ...values,
        logo: null,
        banner: null,
        slug,
      };

      const sellerId = await createSellerAction(session?.user?.email, shopData);

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

      if (logoUrl || bannerUrl) {
        const updatedData = {
          ...shopData,
          logo: logoUrl || null,
          banner: bannerUrl || null,
        };
        await updateSellerAction(session?.user?.email, updatedData);
      }

      toast.success("Shop created successfully!");
      onContinue({ shopSlug: slug });
    } catch (error) {
      console.error("Error creating shop:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
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
              Create your store
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set up your public storefront. Buyers will see this when they visit
              your shop.
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
                  Upload a banner and logo for your storefront (optional).
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
                      id="onboarding-shop-banner"
                      title="Upload shop banner"
                      description="Use a wide visual that represents your shop."
                      buttonLabel="Upload"
                      onChange={handleBannerChange}
                      summary={
                        bannerFile?.name || "No banner selected yet"
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
                      id="onboarding-shop-logo"
                      title="Upload shop logo"
                      description="Use a clear square logo or avatar."
                      buttonLabel="Upload"
                      onChange={handleLogoChange}
                      summary={
                        logoFile?.name || "No logo selected yet"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              className="h-12 rounded-full bg-linear-to-r from-primary-brand to-red-400 px-8 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating store...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="relative h-36 bg-slate-100">
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
            <div className="absolute -top-10 left-5 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xs">
              {logo ? (
                <Image
                  src={logo}
                  alt="Shop Logo Preview"
                  className="object-cover"
                  fill
                  unoptimized={true}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-50 text-slate-400">
                  <Store className="h-6 w-6" />
                </div>
              )}
            </div>

            <p className="line-clamp-1 text-lg font-semibold text-slate-950">
              {form.watch("name") || "Your shop name"}
            </p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {form.watch("description") ||
                "Your shop description preview will appear here as you type."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
