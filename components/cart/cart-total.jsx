"use client";

export default function CartTotal({ subTotal }) {
  return (
    <div className="p-4 w-full lg:w-1/2">
      <h4 className="font-semibold text-xl">Cart Total</h4>

      <div className="flex justify-between items-center py-2">
        <p>Subtotal:</p>
        <p>₹{subTotal?.toFixed(2)}</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p>Shipping fee:</p>
        <p>₹0</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p className="font-bold">Total:</p>
        <p className="font-bold">₹{subTotal?.toFixed(2)}</p>
      </div>
    </div>
  );
}
