"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { infoSchema } from "@/lib/schema";
import { UserDetailsAction } from "@/actions/user-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InfoForm() {
  const router = useRouter();
  const [otherSource, setOtherSource] = useState("");
  const [otherSourceInput, setOtherSourceInput] = useState("");

  const form = useForm({
    resolver: zodResolver(infoSchema),
  });

  async function onSubmit(data) {
    try {
      if (data.source === "other" && otherSourceInput) {
        await UserDetailsAction(null, `Other: ${otherSourceInput}`);
      } else {
        await UserDetailsAction(null, data.source);
      }
      router.replace("/");
    } catch (error) {
      throw new Error(
        "Error submitting your source information. Please try again later!",
      );
    }
  }

  const isSubmitDisabled =
    form.formState.isSubmitting ||
    (otherSource && otherSourceInput.trim().length === 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">
                How did you find out about Crelands?
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  if (val === "other") {
                    setOtherSource(true);
                  } else {
                    setOtherSource(false);
                  }
                  field.onChange(val);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {otherSource && (
          <div className="space-y-2">
            <Label htmlFor="other-source">Please specify</Label>
            <Input
              id="other-source"
              placeholder="Enter how you found us"
              value={otherSourceInput}
              onChange={(e) => setOtherSourceInput(e.target.value)}
            />
            {otherSourceInput.trim().length === 0 && (
              <p className="text-sm text-destructive">
                This field is required.
              </p>
            )}
          </div>
        )}

        <Button type="submit" disabled={isSubmitDisabled}>
          {form.formState.isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
