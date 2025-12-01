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
import { useState } from "react";
import { RecipePrint } from "./print-recipe";

export default function CartDialog() {
  const { cart, removeFromCart } = useCart();

  const [inputs, setInputs] = useState<{
    [key: string]: {
      dose?: string;
      times?: string;
      timesOption?: string;
      perDay?: string;
    };
  }>({});

  const handleInputChange = (id: string, field: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger className="mr-3 relative">
          <ReceiptText className="cursor-pointer " />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </DialogTrigger>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ЖОР</DialogTitle>
          </DialogHeader>

          {cart.map((el) => (
            <div key={el.id} className="border p-2 mb-1 rounded mt-2">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-xl no-print">{el.name}</p>
                <div className="w-full flex flex-col gap-2 text-sm">
                  <input
                    value={inputs[el.id]?.dose || ""}
                    onChange={(e) =>
                      handleInputChange(el.id, "dose", e.target.value)
                    }
                    className="no-print border p-1 rounded w-full"
                    placeholder="Тун заавар"
                  />
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={inputs[el.id]?.times || ""}
                        onChange={(e) =>
                          handleInputChange(el.id, "times", e.target.value)
                        }
                        className="no-print border p-1 rounded w-16"
                        placeholder="Удаа"
                      />
                      <select
                        value={inputs[el.id]?.timesOption || "Удаа өдөрт"}
                        onChange={(e) =>
                          handleInputChange(
                            el.id,
                            "timesOption",
                            e.target.value
                          )
                        }
                        className="no-print border p-1 rounded"
                      >
                        <option>Удаа өдөрт</option>
                        <option>Цагийн зайтай</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 no-print">
                      <input
                        value={inputs[el.id]?.perDay || ""}
                        onChange={(e) =>
                          handleInputChange(el.id, "perDay", e.target.value)
                        }
                        className="no-print border p-1 rounded w-16"
                        placeholder="Өдөр"
                      />
                      <p>Өдөр ууна</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(el.id)}
                className="text-red-500 text-sm mt-2 hover:text-red-600 no-print"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}

          {cart.length > 0 && (
            <Button onClick={() => window.print()} className="no-print bg-[#00AC94]">
              Хэвлэх
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <RecipePrint cart={cart} inputs={inputs} />
    </div>
  );
}
