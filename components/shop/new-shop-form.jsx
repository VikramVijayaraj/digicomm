"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

const shopSchema = z.object({
  logo: z.any().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

export default function NewShopForm() {
  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      logo: "",
      name: "",
      description: "",
    },
  });

  const [logo, setLogo] = useState();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  }

  async function onSubmit(values) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update user as seller
    // await crea

    console.log(values);
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
