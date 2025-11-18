"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-context";
import CartDialog from "./cart-dialog";



export default function CartIcon() {
  const { cart } = useCart();

  return (
    <div className="relative">
      <CartDialog />

      <ShoppingCart size={26} className="cursor-pointer" />

      {cart.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 py-0.5 rounded-full">
          {cart.length}
        </span>
      )}
    </div>
  );
}
