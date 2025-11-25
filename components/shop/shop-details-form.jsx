"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import slugify from "slugify";

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
    <div className="flex flex-col items-center justify-between space-y-8">
      <div className="w-full max-w-2xl space-y-4 relative">
        {banner && (
          <div className="w-full h-48 relative">
            <Image
              src={banner}
              alt="Shop Banner Preview"
              className="object-cover"
              fill
              unoptimized={true}
            />
          </div>
        )}
        <div className="absolute -bottom-20 left-[35%]">
          <div className="w-32 h-32 relative m-auto">
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
        </div>
      </div>
      {/* <div className="w-32 h-32 relative">
        {logo ? (
          <div className="mt-4">
            <Image
              src={logo}
              alt="Shop Logo Preview"
              className="object-cover"
              fill
            />
          </div>
        ) : (
          <Image
            className="object-cover"
            src="/images/shop-avatar.png"
            alt="Shop Avatar"
            fill
          />
        )}
      </div> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full flex flex-col pt-16"
        >
          {/* Banner Image */}
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Banner</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Image */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter shop name" {...field} />
                </FormControl>
                <FormDescription>
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
                <FormLabel>Shop Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter shop description" {...field} />
                </FormControl>
                <FormDescription>
                  Tell something about your shop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
