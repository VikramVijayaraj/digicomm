import { getAllSellersBankDetails } from "@/lib/db/sellers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateConverter } from "@/utils/dateConverter";
import ChangeVerificationStatus from "./change-verification-status";

export default async function AdminSellersBankDetailsPage() {
  const allBankDetails = await getAllSellersBankDetails();

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-10">
        Sellers Bank Details Management
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(allBankDetails[0]).map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allBankDetails.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.id}</TableCell>
              <TableCell>{detail.seller_id}</TableCell>
              <TableCell>{detail.account_holder_name}</TableCell>
              <TableCell>{detail.account_number}</TableCell>
              <TableCell>{detail.ifsc_code}</TableCell>
              <TableCell>{detail.phone}</TableCell>
              <TableCell>{dateConverter(detail.created_at)}</TableCell>
              <TableCell>{dateConverter(detail.updated_at)}</TableCell>

              <TableCell>
                <ChangeVerificationStatus
                  currentStatus={detail.verification_status}
                />
              </TableCell>

              <TableCell>{detail.verification_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
