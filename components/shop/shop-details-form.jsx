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
      logo: "",
      name: data?.shop_name || "",
      description: data?.shop_description || "",
    },
  });

  const router = useRouter();
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
    const slug = slugify(values.name);

    values["logo"] = imageUrl;
    values["slug"] = slug;

    // Delete old file from firebase
    if (imageUrl) {
      await deleteFromFirebase(`shop-images/logos/${data?.shop_logo}`);
    }

    // Update shop details if data is available, otherwise create new.
    if (data) {
      const updatedData = { ...values };
      updatedData["logo"] = imageUrl || data?.shop_logo;

      // const slug = slugify(updatedData.name);
      // updatedData["slug"] = slug;

      await updateSellerAction(session?.user?.email, updatedData);
      toast.success("Shop details updated!");
    } else {
      // const slug = slugify(values.name);
      // updatedData["slug"] = slug;

      await createSellerAction(session?.user?.email, values);
      toast.success("Shop created successfully!");
    }

    // After registering the shop, user is redirected to dashboard.
    if (pathname === "/your/shop/register") {
      router.push("/your/shop/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between space-y-8">
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
          className="space-y-8 w-full flex flex-col"
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

          <Button
            className="w-full lg:w-1/4"
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
