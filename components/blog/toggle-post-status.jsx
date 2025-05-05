"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { togglePostStatusAction } from "@/actions/blog-actions";
import { set } from "zod";

export default function TogglePostStatus({ post }) {
  const [status, setStatus] = useState(post.published_status);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSwitchChange(postId, newStatus) {
    setIsLoading(true);
    setStatus(newStatus);

    await togglePostStatusAction(postId, newStatus);
    setIsLoading(false);
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="post-status"
        checked={status}
        onCheckedChange={() =>
          handleSwitchChange(post.id, !post.published_status)
        }
        disabled={isLoading}
      />
      <Label htmlFor="post-status">Active</Label>
    </div>
  );
}
