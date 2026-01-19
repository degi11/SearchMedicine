// components/dose-usage-table.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiseaseInvoice } from "@/types";

type Props = {
  invoices: DiseaseInvoice[];
};

export function DoseUsageTable({ invoices }: Props) {
  if (!invoices?.length) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <Table className="bg-green-50 table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Нас</TableHead>
            <TableHead className="w-[40%]">Тун</TableHead>
            <TableHead className="w-[40%]">Давтамж</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((disease, dIndex) => (
            <React.Fragment key={dIndex}>
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-lg">
                  {disease.diseaseName}
                </TableCell>
              </TableRow>

              {disease.stages?.map((stage, sIndex) => (
                <React.Fragment key={sIndex}>
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold">
                      {stage.name}
                    </TableCell>
                  </TableRow>

                  {stage.rows.map((row, rIndex) => (
                    <TableRow key={rIndex}>
                      <TableCell className="break-all whitespace-normal">
                        {row.age}
                      </TableCell>
                      <TableCell className="break-all whitespace-normal">
                        {row.dose}
                      </TableCell>
                      <TableCell className="break-all whitespace-normal">
                        {row.useTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
