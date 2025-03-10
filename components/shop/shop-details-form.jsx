"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
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
import deleteFromFirebase from "@/utils/firebase";

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

  // Upload Logo To Firebase
  async function uploadImage(file, path) {
    if (!file) return; // Return if no file is selected

    const splittedFileName = file.name.toString().split(".");
    const storageRef = ref(
      storage,
      `${path}/${splittedFileName[0] + "_" + uuid() + "." + splittedFileName[1]}`,
    ); // Create a reference to the file in Firebase Storage
    // const storageRef = ref(storage, `shop-images/logos/${file.name + uuid()}`); // Create a reference to the file in Firebase Storage

    try {
      await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
      const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      console.log("File Uploaded Successfully");
      return url;
    } catch (error) {
      console.error("Error uploading the file", error);
      throw new Error("Failed to upload image");
    }
  }

  async function onSubmit(values) {
    const logoUrl = await uploadImage(logoFile, "shop-images/logos");
    const bannerUrl = await uploadImage(bannerFile, "shop-images/banners");
    // const imageUrl = await uploadImage();
    const slug = slugify(values.name);

    const updatedValues = {
      ...values,
      logo: logoUrl || data?.shop_logo,
      banner: bannerUrl || data?.shop_banner,
      slug,
    };
    // values["logo"] = logoUrl;
    // values["banner"] = bannerUrl;
    // values["slug"] = slug;

    // Delete old files from firebase if new ones were uploaded
    if (logoUrl && data?.shop_logo) {
      await deleteFromFirebase(`shop-images/logos/${data?.shop_logo}`);
    }
    if (bannerUrl && data?.shop_banner) {
      await deleteFromFirebase(`shop-images/banners/${data?.shop_banner}`);
    }
    // // Delete old file from firebase
    // if (imageUrl) {
    //   await deleteFromFirebase(`shop-images/logos/${data?.shop_logo}`);
    // }

    // Update shop details if data is available, otherwise create new.
    if (data) {
      // const updatedData = { ...values };
      // updatedData["logo"] = imageUrl || data?.shop_logo;

      await updateSellerAction(session?.user?.email, updatedValues);
      toast.success("Shop details updated!");
    } else {
      await createSellerAction(session?.user?.email, updatedValues);
      toast.success("Shop created successfully!");
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
              />
            ) : (
              <Image
                className="object-cover"
                src="/images/shop-avatar.png"
                alt="Shop Avatar"
                fill
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
