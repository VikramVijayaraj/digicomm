import Link from "next/link";

export default function CartTotal({ page }) {
  return (
    <div className="border border-gray-300 rounded-sm p-8 w-full mt-8">
      <h4 className="font-bold text-xl">Cart Total</h4>

      {/* Cart Summary */}
      <div className="flex justify-between items-center py-2">
        <p>Subtotal:</p>
        <p>$1800</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p>Shipping fee:</p>
        <p>$0</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p>Total:</p>
        <p>$1800</p>
      </div>

      {/* Proceed To Checkout */}
      {page === "checkout" ? (
        ""
      ) : (
        <Link href="/cart/checkout">
          <div className="bg-primary rounded-sm text-center cursor-pointer mt-2 hover:bg-primary-dark">
            <button className="text-white p-2">Proceed to checkout</button>
          </div>
        </Link>
      )}
    </div>
  );
}
