import { PrintRecipeProps } from "@/types";
import EntoPharmaLogo from "../ascents/ENTO Pharm logo jijig.png";
import Image from "next/image";

export function RecipePrint({ cart, inputs }: PrintRecipeProps) {
  return (
    <div className="print-area print-only">
      <div className="flex gap-2">
        <Image
          src="https://res.cloudinary.com/dqrd7tpyd/image/upload/v1764811369/h05zbzifinfcybrqb8h9.png"
          alt="EntoPharmaLogo"
          width={140}
          height={120}
          className="object-cover"
        />
        <h2 className="font-bold text-lg text-gray-800"></h2>
      </div>

      {cart.map((el) => (
        <div key={el.id} className="flex flex-col border-b py-1 text-sm">
          <p className="font-semibold">{el.name}</p>
          {inputs[el.id]?.dose && <p>Уух заавар: {inputs[el.id].dose}</p>}
          <div className="flex gap-3">
            {inputs[el.id]?.times && (
              <p>
                {inputs[el.id].times}
                <span> - </span>
                {inputs[el.id].timesOption || "Удаа өдөрт"}
              </p>
            )}
            {inputs[el.id]?.perDay && <p>{inputs[el.id].perDay} - Өдөр ууна</p>}
          </div>
          <p>Хадгалах нөхцөл: {el.storageCo}</p>
        </div>
      ))}
    </div>
  );
}
