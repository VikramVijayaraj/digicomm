import { Edit, Info } from "lucide-react";

import BankDetailsForm from "@/components/shop/bank-details-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSellerBankDetails } from "@/lib/db/sellers";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/utils/supabase/server";

export default async function ShopPayment() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const bankDetails = await getSellerBankDetails(data?.user?.email);

  if (!bankDetails) {
    return (
      <div className="w-full space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Bank Details
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-8">Add Bank Details</Button>
            </DialogTrigger>
            <DialogContent className="space-y-2">
              <DialogHeader>
                <DialogTitle>Add Bank Details</DialogTitle>
                <DialogDescription>
                  To get paid, please provide your bank account details.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
              <BankDetailsForm session={data} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-100/70 text-yellow-800 text-sm">
          <Info />
          <p>Payments are processed every weekend to your bank account.</p>
        </div>

        <p className="text-center">
          Add bank details to get paid for your sales.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Bank Details
          </h1>

          {/* Verification Status */}
          <div className="flex items-center gap-2">
            {bankDetails.verification_status && (
              <Badge
                className={`w-fit ${
                  {
                    SUCCESS: "bg-green-600",
                    PENDING: "bg-blue-600",
                    REJECTED: "bg-red-600",
                  }[bankDetails.verification_status]
                }`}
              >
                {
                  {
                    SUCCESS: "Verified",
                    PENDING: "Under Review",
                    REJECTED: "Rejected",
                  }[bankDetails.verification_status]
                }
              </Badge>
            )}

            {bankDetails.verification_status === "PENDING" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={20} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>It takes 3 to 5 business days to complete the review.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Edit size={20} />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-2">
            <DialogHeader>
              <DialogTitle>Edit Bank Details</DialogTitle>
              <DialogDescription>
                Updated bank details will be validated upon submission.
              </DialogDescription>
            </DialogHeader>

            {/* Form */}
            <BankDetailsForm session={data} existingData={bankDetails} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bank Details */}
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Account Holder Name</TableCell>
            <TableCell>{bankDetails.account_holder_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Account Number</TableCell>
            <TableCell>{bankDetails.account_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">IFSC Code</TableCell>
            <TableCell>{bankDetails.ifsc_code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Phone Number</TableCell>
            <TableCell>{bankDetails.phone}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
