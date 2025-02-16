"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateConverter } from "@/utils/dateConverter";
import Link from "next/link";

export default function OrdersListContainer({ orderData }) {
  console.log(orderData);
  return (
    <>
      {orderData.map((order) => (
        <Link
          href={`/your/shop/dashboard/order-details?order_id=${order.order_id}&item_id=${order.item_id}`}
          key={order.order_id}
        >
          <Card className="mb-2 cursor-pointer text-sm md:text-base hover:drop-shadow-lg">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px]">
                <Image
                  src={order.product_image}
                  fill
                  alt=""
                  style={{ objectFit: "cover" }}
                  className="rounded-t-md"
                />
              </div>
              <div className="flex flex-col justify-between">
                <p className="font-semibold line-clamp-1 lg:line-clamp-2">
                  {order.product_name}
                </p>
                <CardDescription>{order.item_id}</CardDescription>
              </div>
              <div className="flex flex-col justify-between">
                <p>Quantity: {order.quantity}</p>
                <p>{dateConverter(order.order_date)}</p>
              </div>
              {/* <p>₹{order.price}</p> */}
              <p className="font-semibold">
                ₹{(Number(order.price) * order.quantity).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}
