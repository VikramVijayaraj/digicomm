import { FaTrash } from "react-icons/fa6";

import TableData from "@/components/cart/table-data";
import TableHeading from "@/components/cart/table-heading";
import Quantity from "@/components/product/quantity";
import CartTotal from "@/components/cart/cart-total";

export default function CartPage() {
  return (
    <div className="global-padding">
      <table className="w-full">
        <thead>
          <tr className="shadow-md rounded-sm">
            <TableHeading>Product</TableHeading>
            <TableHeading>Price</TableHeading>
            <TableHeading>Quanitity</TableHeading>
            <TableHeading>Subtotal</TableHeading>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>MacBook M1 Pro</TableData>
            <TableData>$1999</TableData>
            <TableData>
              <Quantity initialValue={2} width="32" />
            </TableData>
            <TableData>${1999 * 2}</TableData>
            <TableData>
              <FaTrash className="text-red-500 cursor-pointer hover:text-primary-dark" />
            </TableData>
          </tr>
          <tr>
            <TableData>MacBook M1 Pro</TableData>
            <TableData>$1999</TableData>
            <TableData>
              <Quantity initialValue={2} width="32" />
            </TableData>
            <TableData>${1999 * 2}</TableData>
          </tr>
        </tbody>
      </table>

      {/* Checkout */}
      <CartTotal />
    </div>
  );
}
