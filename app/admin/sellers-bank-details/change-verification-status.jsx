"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChangeVerificationStatus({ currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Select onValueChange={(value) => console.log(value)}>
      <SelectTrigger>
        <SelectValue placeholder={currentStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">PENDING</SelectItem>
        <SelectItem value="success" className="text-green-500">
          SUCCESS
        </SelectItem>
        <SelectItem value="rejected" className="text-red-500">
          REJECTED
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
