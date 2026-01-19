import { DiseaseInvoice, DoseRow } from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TrashIcon } from "lucide-react";

type Props = {
  value: DiseaseInvoice[];
  onChange: (v: DiseaseInvoice[]) => void;
};

export function DoseUsageInputs({ value, onChange }: Props) {
  const updateDiseaseName = (dIndex: number, val: string) => {
    const clone = [...value];
    clone[dIndex].diseaseName = val;
    onChange(clone);
  };

  const updateStageName = (dIndex: number, sIndex: number, val: string) => {
    const clone = [...value];
    clone[dIndex].stages[sIndex].name = val;
    onChange(clone);
  };

  const updateRow = (
    dIndex: number,
    sIndex: number,
    rIndex: number,
    field: keyof DoseRow,
    val: string
  ) => {
    const clone = [...value];
    clone[dIndex].stages[sIndex].rows[rIndex][field] = val;
    onChange(clone);
  };

  const addRow = (dIndex: number, sIndex: number) => {
    const clone = [...value];
    clone[dIndex].stages[sIndex].rows.push({
      age: "",
      dose: "",
      useTime: "",
    });
    onChange(clone);
  };

  const removeRow = (dIndex: number, sIndex: number, rIndex: number) => {
    const clone = [...value];
    clone[dIndex].stages[sIndex].rows.splice(rIndex, 1);

    if (clone[dIndex].stages[sIndex].rows.length === 0) {
      clone[dIndex].stages[sIndex].rows.push({
        age: "",
        dose: "",
        useTime: "",
      });
    }

    onChange(clone);
  };

  const addStage = (dIndex: number) => {
    const clone = [...value];

    if (!clone[dIndex].stages) {
      clone[dIndex].stages = [];
    }

    clone[dIndex].stages.push({
      name: "",
      rows: [{ age: "", dose: "", useTime: "" }],
    });

    onChange(clone);
  };

  const removeStage = (dIndex: number, sIndex: number) => {
    const clone = [...value];
    clone[dIndex].stages.splice(sIndex, 1);

    if (clone[dIndex].stages.length === 0) {
      clone[dIndex].stages.push({
        name: "",
        rows: [{ age: "", dose: "", useTime: "" }],
      });
    }

    onChange(clone);
  };

  const addDisease = () => {
    onChange([
      ...value,
      {
        diseaseName: "",
        stages: [
          {
            name: "",
            rows: [{ age: "", dose: "", useTime: "" }],
          },
        ],
      },
    ]);
  };

  const removeDisease = (dIndex: number) => {
    const clone = [...value];
    clone.splice(dIndex, 1);

    onChange(
      clone.length
        ? clone
        : [
            {
              diseaseName: "",
              stages: [
                {
                  name: "",
                  rows: [{ age: "", dose: "", useTime: "" }],
                },
              ],
            },
          ]
    );
  };

  return (
    <div className="col-span-2 border p-3">
      <h2 className="font-semibold mb-2">Хэрэглэх тун (өвчнөөр)</h2>

      {value.map((disease, dIndex) => (
        <div key={dIndex} className="border p-3 mb-4">
          <Input
            placeholder="Өвчний нэр"
            value={disease.diseaseName}
            onChange={(e) => updateDiseaseName(dIndex, e.target.value)}
          />

          {(disease.stages ?? []).map((stage, sIndex) => (
            <div key={sIndex} className="mt-3 border p-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Үе шат (ж: Эхний), урьдчилан сэрнийлэх бол хоосон орхи"
                  value={stage.name}
                  onChange={(e) =>
                    updateStageName(dIndex, sIndex, e.target.value)
                  }
                />
                <Button
                  variant="destructive"
                  onClick={() => removeStage(dIndex, sIndex)}
                  type="button"
                >
                  −
                </Button>
              </div>

              {stage.rows.map((row, rIndex) => (
                <div key={rIndex} className="grid grid-cols-4 gap-2 mt-2">
                  <Input
                    placeholder="Нас"
                    value={row.age}
                    onChange={(e) =>
                      updateRow(dIndex, sIndex, rIndex, "age", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Тун"
                    value={row.dose}
                    onChange={(e) =>
                      updateRow(dIndex, sIndex, rIndex, "dose", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Хугацаа"
                    value={row.useTime}
                    onChange={(e) =>
                      updateRow(
                        dIndex,
                        sIndex,
                        rIndex,
                        "useTime",
                        e.target.value
                      )
                    }
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeRow(dIndex, sIndex, rIndex)}
                    type="button"
                  >
                    −
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => addRow(dIndex, sIndex)}
                className="mt-2 bg-green-500"
                type="button"
              >
                + Тун нэмэх
              </Button>
            </div>
          ))}

          <div className="w-full flex justify-between">
            <Button onClick={() => addStage(dIndex)} className="mt-2 bg-blue-500" type="button">
            + Үе шат нэмэх
          </Button>

          <Button
            variant="destructive"
            className="mt-2 ml-2"
            onClick={() => removeDisease(dIndex)}
            type="button"
          >
            <TrashIcon />
          </Button>  
          </div>
        </div>
      ))}

      <Button onClick={addDisease} className="bg-blue-600" type="button">
        + Өвчин нэмэх
      </Button>
    </div>
  );
}
