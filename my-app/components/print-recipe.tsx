import { PrintRecipeProps } from "@/types";
import EntoPharmaLogo from "../ascents/ENTO Pharm logo jijig.png";
import PharmaBlackIcon from "../ascents/ENTO pharma logo khar.png"

export function RecipePrint({ cart, inputs }: PrintRecipeProps) {
  return (
    <div className="print-area print-only">
      <div className="flex gap-2">
        <img
          src={PharmaBlackIcon.src}
          alt="EntoPharmaLogo"
          width={100}
          height={80}
          style={{ display: "block" }}
          loading="eager"
        />
        <h2 className="font-bold text-lg text-gray-800"></h2>
      </div>

      {cart.map((el) => (
        <div key={el.id} className="flex flex-col border-b py-1 text-sm">
          <p className="font-semibold">{el.name}</p>
          {inputs[el.id]?.doseType && <p>{inputs[el.id].doseType}</p>}
          {inputs[el.id]?.howToUse && (
            <p>Хэрэглэх заавар: {inputs[el.id].howToUse}</p>
          )}
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
