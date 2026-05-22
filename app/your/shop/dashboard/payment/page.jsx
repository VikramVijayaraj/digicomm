import { Edit, Info, Landmark, Plus, ShieldCheck, Wallet } from "lucide-react";

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
import { getSellerBankDetails } from "@/lib/db/sellers";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/utils/supabase/server";

const statusMap = {
  SUCCESS: {
    label: "Verified",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  PENDING: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

function BankDetailsDialog({ trigger, title, description, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.75rem] border-slate-200 p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            {title}
          </DialogTitle>
          <DialogDescription className="leading-6 text-slate-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default async function ShopPayment() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const bankDetails = await getSellerBankDetails(data?.user?.email);
  const status = bankDetails?.verification_status
    ? statusMap[bankDetails.verification_status]
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <Wallet className="h-4 w-4" />
              Seller Payments
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Payment Details
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Add and manage the bank account where payouts from your sales are
              sent.
            </p>
          </div>

          <BankDetailsDialog
            title={bankDetails ? "Edit Bank Details" : "Add Bank Details"}
            description={
              bankDetails
                ? "Updated bank details will be validated upon submission."
                : "To get paid, please provide your bank account details."
            }
            trigger={
              <Button
                variant={bankDetails ? "outline" : "default"}
                className={
                  bankDetails
                    ? "h-12 rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    : "h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-5 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
                }
              >
                {bankDetails ? (
                  <Edit className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {bankDetails ? "Edit Details" : "Add Bank Details"}
              </Button>
            }
          >
            <BankDetailsForm session={data} existingData={bankDetails} />
          </BankDetailsDialog>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Payout Cycle
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Every weekend
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Payments are processed to your registered bank account.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Verification
          </p>
          <div className="mt-2 flex items-center gap-2">
            {status ? (
              <Badge className={`rounded-full px-3 py-1 ${status.className}`}>
                {status.label}
              </Badge>
            ) : (
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                Not added
              </Badge>
            )}

            {bankDetails?.verification_status === "PENDING" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>It takes 3 to 5 business days to complete the review.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bank details are reviewed before payouts are sent.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <Landmark className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Account
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            {bankDetails ? "Bank details saved" : "Bank details required"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {bankDetails
              ? "Review the account details below."
              : "Add bank details to receive payouts."}
          </p>
        </div>
      </section>

      {bankDetails ? (
        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Registered Bank Account
            </p>
          </div>
          <div className="divide-y divide-slate-200">
            {[
              ["Account Holder Name", bankDetails.account_holder_name],
              ["Account Number", bankDetails.account_number],
              ["IFSC Code", bankDetails.ifsc_code],
              ["Phone Number", bankDetails.phone],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6"
              >
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <Landmark className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-950">
            Add bank details to get paid
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Your payout account is required before seller payments can be
            processed.
          </p>
        </section>
      )}
    </div>
  );
}
