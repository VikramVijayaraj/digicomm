"use client";

export default function CartTotal({ subTotal }) {
  return (
    <div className="w-full">
      <h4 className="font-semibold text-2xl text-center mb-5">Cart Total</h4>

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
