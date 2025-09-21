import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { getBuyerDetails } from "@/lib/db/sellers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateConverter } from "@/utils/dateConverter";
import OrderTrackingEmailForm from "@/components/shop/order-tracking-email-form";

export default async function ShopOrderDetails({ searchParams }) {
  const { order_id: orderId, item_id: itemId } = searchParams;
  const buyerDetails = await getBuyerDetails(orderId, itemId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/products/${buyerDetails.product_slug}`}
                className="hover:underline cursor-pointer"
              >
                <CardTitle>{buyerDetails.product_name}</CardTitle>
              </Link>
              <CardDescription>
                Quantity: {buyerDetails.quantity}
              </CardDescription>
              <p className="my-2">
                Ordered at: {dateConverter(buyerDetails.order_date)}
              </p>
              <p className="font-semibold text-lg">
                ₹
                {(Number(buyerDetails.price) * buyerDetails.quantity).toFixed(
                  2,
                )}
              </p>
            </div>

            <div className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px] p-0">
              <Image
                src={buyerDetails.product_image}
                fill
                alt=""
                style={{ objectFit: "cover" }}
                className="rounded-t-md"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-fit mb-2 space-y-1">
            <p className="text-gray-600 text-sm">Customer Details</p>
            <Separator />
          </div>
          <p>{buyerDetails.full_name}</p>
          <p>{buyerDetails.address}</p>
          <p>
            <strong>Email:</strong> {buyerDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {buyerDetails.phone}
          </p>
        </CardContent>
      </Card>

      {/* Email form for tracking info */}
      {/* <Card className="border-none shadow-none">
        <CardContent>
          <OrderTrackingEmailForm buyerDetails={buyerDetails} />
        </CardContent>
      </Card> */}
    </div>
  );
}
