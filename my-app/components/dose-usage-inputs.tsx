import { DiseaseInvoice, DoseRow } from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Trash2, ChevronRight } from "lucide-react";

type Props = {
  value: DiseaseInvoice[];
  onChange: (v: DiseaseInvoice[]) => void;
};

const EMPTY_ROW: DoseRow = { age: "", dose: "", useTime: "" };
const EMPTY_STAGE = { name: "", rows: [{ ...EMPTY_ROW }] };
const EMPTY_DISEASE: DiseaseInvoice = {
  diseaseName: "",
  stages: [{ ...EMPTY_STAGE, rows: [{ ...EMPTY_ROW }] }],
};

export function DoseUsageInputs({ value, onChange }: Props) {
  const clone = () => structuredClone(value);

  const updateDiseaseName = (di: number, val: string) => {
    const d = clone(); d[di].diseaseName = val; onChange(d);
  };
  const updateStageName = (di: number, si: number, val: string) => {
    const d = clone(); d[di].stages[si].name = val; onChange(d);
  };
  const updateRow = (di: number, si: number, ri: number, field: keyof DoseRow, val: string) => {
    const d = clone(); d[di].stages[si].rows[ri][field] = val; onChange(d);
  };

  const addRow = (di: number, si: number) => {
    const d = clone(); d[di].stages[si].rows.push({ ...EMPTY_ROW }); onChange(d);
  };
  const removeRow = (di: number, si: number, ri: number) => {
    const d = clone();
    d[di].stages[si].rows.splice(ri, 1);
    if (!d[di].stages[si].rows.length) d[di].stages[si].rows.push({ ...EMPTY_ROW });
    onChange(d);
  };

  const addStage = (di: number) => {
    const d = clone();
    d[di].stages.push({ ...EMPTY_STAGE, rows: [{ ...EMPTY_ROW }] });
    onChange(d);
  };
  const removeStage = (di: number, si: number) => {
    const d = clone();
    d[di].stages.splice(si, 1);
    if (!d[di].stages.length) d[di].stages.push({ ...EMPTY_STAGE, rows: [{ ...EMPTY_ROW }] });
    onChange(d);
  };

  const addDisease = () => onChange([...value, structuredClone(EMPTY_DISEASE)]);
  const removeDisease = (di: number) => {
    const d = clone();
    d.splice(di, 1);
    onChange(d.length ? d : [structuredClone(EMPTY_DISEASE)]);
  };


  return (
    <div className="space-y-4">
      {value.map((disease, di) => (
        <div key={di} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <div className="flex items-center gap-2 bg-white border-b border-gray-200 px-4 py-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 shrink-0">
              Өвчин {di + 1}
            </span>
            <Input
              placeholder="Өвчний нэрийг оруулах..."
              value={disease.diseaseName}
              onChange={(e) => updateDiseaseName(di, e.target.value)}
              className="border bg-transparent shadow-none focus-visible:ring-0 font-medium text-gray-800 px-2 h-8"
            />
            <button
              type="button"
              onClick={() => removeDisease(di)}
              className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-3">
            {disease.stages.map((stage, si) => (
              <div key={si} className="rounded-md border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <Input
                    placeholder="Үе шатны нэр (Урьдчилсан бол заавал биш)"
                    value={stage.name}
                    onChange={(e) => updateStageName(di, si, e.target.value)}
                    className=" bg-transparent shadow-none focus-visible:ring-0 text-sm text-gray-700  h-7"
                  />
                  <button
                    type="button"
                    onClick={() => removeStage(di, si)}
                    className="shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 px-3 pt-2 pb-1">
                  {["Нас", "Тун", "Хугацаа", ""].map((h, i) => (
                    <span key={i} className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="px-3 pb-2 space-y-1.5">
                  {stage.rows.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center">
                      <Input
                        placeholder="0–18 нас"
                        value={row.age}
                        onChange={(e) => updateRow(di, si, ri, "age", e.target.value)}
                        className="h-8 text-sm border-gray-200"
                      />
                      <Input
                        placeholder="500мг"
                        value={row.dose}
                        onChange={(e) => updateRow(di, si, ri, "dose", e.target.value)}
                        className="h-8 text-sm border-gray-200"
                      />
                      <Input
                        placeholder="Өдөрт 3 удаа"
                        value={row.useTime}
                        onChange={(e) => updateRow(di, si, ri, "useTime", e.target.value)}
                        className="h-8 text-sm border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeRow(di, si, ri)}
                        className="flex items-center justify-center w-8 h-8 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-3 pb-3">
                  <button
                    type="button"
                    onClick={() => addRow(di, si)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium py-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Тун нэмэх
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addStage(di)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium py-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Үе шат нэмэх
            </button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addDisease}
        className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors h-10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Өвчин нэмэх
      </Button>
    </div>
  );
}