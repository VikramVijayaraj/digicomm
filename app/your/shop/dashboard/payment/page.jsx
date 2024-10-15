import { Edit } from "lucide-react";

import { auth } from "@/auth";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSellerBankDetails } from "@/lib/db/sellers";
import { Badge } from "@/components/ui/badge";

export default async function ShopPayment() {
  const session = await auth();

  const bankDetails = await getSellerBankDetails(session?.user?.email);

  if (!bankDetails) {
    return (
      <div className="w-full md:w-2/3 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Bank Details
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Bank Details</Button>
            </DialogTrigger>
            <DialogContent className="space-y-2">
              <DialogHeader>
                <DialogTitle>Add Bank Details</DialogTitle>
                <DialogDescription>
                  To get paid, please provide your bank account details.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
              <BankDetailsForm session={session} />
            </DialogContent>
          </Dialog>
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
          <div>
            {bankDetails.verification_status && (
              <Badge
                className={`w-fit ${ { SUCCESS: "bg-green-600", PENDING: "bg-blue-600", REJECTED:
                "bg-red-600", }[bankDetails.verification_status] }`}
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
            <BankDetailsForm session={session} existingData={bankDetails} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bank Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Account Holder Name</Label>
          <Input value={bankDetails.account_holder_name} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input value={bankDetails.account_number} readOnly />
        </div>
        <div className="space-y-2">
          <Label>IFSC Code</Label>
          <Input value={bankDetails.ifsc_code} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input value={bankDetails.phone} readOnly />
        </div>
      </div>
    </div>
  );
}
