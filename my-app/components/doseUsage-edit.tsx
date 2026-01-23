"use client";

import { DiseaseInvoice, DoseRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";

type Props = {
  value: DiseaseInvoice[];
  onChange: (v: DiseaseInvoice[]) => void;
};

export function DoseUsageEditor({ value, onChange }: Props) {
  const update = (fn: (draft: DiseaseInvoice[]) => void) => {
    const clone = structuredClone(value);
    fn(clone);
    onChange(clone);
  };

  return (
    <div className="border p-3 rounded">
      <h2 className="font-semibold mb-2">Уух тун (засах)</h2>

      {value.map((disease, dIndex) => (
        <div key={dIndex} className="border p-3 mb-4 rounded">
          <Input
            value={disease.diseaseName}
            placeholder="Өвчний нэр"
            onChange={(e) =>
              update(v => {
                v[dIndex].diseaseName = e.target.value;
              })
            }
          />

          {disease.stages.map((stage, sIndex) => (
            <div key={sIndex} className="mt-3 border p-2 rounded">
              <div className="flex gap-2">
                <Input
                  value={stage.name}
                  placeholder="Үе шат"
                  onChange={(e) =>
                    update(v => {
                      v[dIndex].stages[sIndex].name = e.target.value;
                    })
                  }
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    update(v => {
                      v[dIndex].stages.splice(sIndex, 1);
                    })
                  }
                >
                  −
                </Button>
              </div>

              {stage.rows.map((row, rIndex) => (
                <div key={rIndex} className="grid grid-cols-4 gap-2 mt-2">
                  <Input
                    value={row.age}
                    placeholder="Нас"
                    onChange={(e) =>
                      update(v => {
                        v[dIndex].stages[sIndex].rows[rIndex].age =
                          e.target.value;
                      })
                    }
                  />
                  <Input
                    value={row.dose}
                    placeholder="Тун"
                    onChange={(e) =>
                      update(v => {
                        v[dIndex].stages[sIndex].rows[rIndex].dose =
                          e.target.value;
                      })
                    }
                  />
                  <Input
                    value={row.useTime}
                    placeholder="Хугацаа"
                    onChange={(e) =>
                      update(v => {
                        v[dIndex].stages[sIndex].rows[rIndex].useTime =
                          e.target.value;
                      })
                    }
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      update(v => {
                        v[dIndex].stages[sIndex].rows.splice(rIndex, 1);
                      })
                    }
                  >
                    −
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                className="mt-2 bg-green-500"
                onClick={() =>
                  update(v => {
                    v[dIndex].stages[sIndex].rows.push({
                      age: "",
                      dose: "",
                      useTime: "",
                    });
                  })
                }
              >
                + Тун нэмэх
              </Button>
            </div>
          ))}

          <div className="flex justify-between mt-3">
            <Button
              type="button"
              className="bg-blue-500"
              onClick={() =>
                update(v => {
                  v[dIndex].stages.push({
                    name: "",
                    rows: [{ age: "", dose: "", useTime: "" }],
                  });
                })
              }
            >
              + Үе шат нэмэх
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                update(v => {
                  v.splice(dIndex, 1);
                })
              }
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
