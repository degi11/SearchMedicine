import { PrintRecipeProps } from "@/types";

export function RecipePrint({ cart, inputs }: PrintRecipeProps) {
  return (
    <div className="print-area print-only">
      <h2 className="font-bold text-lg">ЖОР</h2>
      {cart.map((el) => (
        <div key={el.id} className="border-b py-1 text-sm">
          <p className="font-semibold">{el.name}</p>
          {inputs[el.id]?.dose && <p>Тун: {inputs[el.id].dose}</p>}
          <div className="flex gap-3">
            {inputs[el.id]?.times && (
              <p>
                {inputs[el.id].times}<span> - </span>
                {inputs[el.id].timesOption || "Удаа өдөрт"}
              </p>
            )}
            {inputs[el.id]?.perDay && <p>{inputs[el.id].perDay} - Өдөр ууна</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
