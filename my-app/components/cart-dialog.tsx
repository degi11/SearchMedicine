"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "./cart-context";
import { ReceiptText, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CartDialog() {
  const { cart, removeFromCart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Dialog>
      <DialogTrigger className="mr-3 relative">
        <ReceiptText className="cursor-pointer " />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto print-expand">
        <DialogHeader>
          <DialogTitle>Ойлгомжтой жор</DialogTitle>
        </DialogHeader>

        {cart.map((el) => (
          <div key={el.id} className="border p-2 mb-1 rounded">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{el.name}</p>
              <div className="w-full flex flex-col gap-2 text-sm">
                <Input />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Input className="w-11"/>
                    <select className=" border border-gray-300 rounded-md px-1 py-1 no-print-style">
                      <option>Удаа өдөрт</option>
                      <option>Цагийн зайтай</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-11"/>
                    <p>Өдөр ууна</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(el.id)}
              className="text-red-500 text-sm mt-2 hover:text-red-600 no-print"
            >
              <Trash size={18}/>
            </button>
          </div>
        ))}
        {cart.length > 0 && (
          <Button
            onClick={() => window.print()}
            className="bg-[#00AC94] text-white w-full py-2 rounded-xl mt-4 no-print"
          >
            Хэвлэх
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
