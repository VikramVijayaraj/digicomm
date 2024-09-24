"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { redirect, usePathname } from "next/navigation";

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

// Schema for Shop
const shopSchema = z.object({
  logo: z.any().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

// Component
export default function ShopDetailsForm({ session, data }) {
  // React Hook Form
  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      logo: "",
      name: data?.shop_name || "",
      description: data?.shop_description || "",
    },
  });

  const pathname = usePathname();
  const [logo, setLogo] = useState(data?.shop_logo);
  const [file, setFile] = useState(null);

  // Logo Preview
  function handleImageChange(e) {
    const image = e.target.files[0];
    if (image) {
      setLogo(URL.createObjectURL(image));
      setFile(image);
    }
  }

  // Upload Logo To Firebase
  async function handleUpload() {
    if (!file) return; // Return if no file is selected

    const storageRef = ref(storage, `shop-images/logos/${file.name + uuid()}`); // Create a reference to the file in Firebase Storage

    try {
      await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
      const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      console.log("File Uploaded Successfully");
      return url;
    } catch (error) {
      console.error("Error uploading the file", error);
      throw new Error();
    }
  }

  async function onSubmit(values) {
    const imageUrl = await handleUpload();
    values["logo"] = imageUrl;

    // Update shop details if data is available, otherwise create new.
    if (data) {
      const updatedData = { ...values };
      updatedData["logo"] = data?.shop_logo;
      await updateSellerAction(session?.user?.email, updatedData);
      toast.success("Shop details updated!");
    } else {
      await createSellerAction(session?.user?.email, values);
      toast.success("Shop created successfully!");
    }

    // After registering the shop, user is redirected to dashboard.
    if (pathname === "/your/shop/register") {
      redirect("/your/shop/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between px-24 space-y-8">
      <div className="w-32 h-32 relative">
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
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-md w-full flex flex-col"
        >
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Shop Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
