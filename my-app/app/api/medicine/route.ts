import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const medicine = await prisma.medicine.create({
      data: {
        tradeNameMN: data.tradeNameMN,
        tradeNameEN: data.tradeNameEN,
        barcode: data.barcode ? BigInt(data.barcode) : null,
        internationalName: data.internationalName,
        dosage: data.dosage,
        no: data.no ? Number(data.no) : null,
        dosageForm: data.dosageForm,
        conditionsOfIssue: data.conditionsOfIssue,
        country: data.country,
        registered: data.registered,
        indicationsForUse: data.indicationsForUse,
        prohibitionsPrecautions:
          typeof data.prohibitionsPrecautions === "string"
            ? JSON.parse(data.prohibitionsPrecautions)
            : data.prohibitionsPrecautions || null,
        sideEffects: data.sideEffects,
        interactionWithOtherDrugs:
          typeof data.interactionWithOtherDrugs === "string"
            ? JSON.parse(data.interactionWithOtherDrugs)
            : data.interactionWithOtherDrugs || null,
        useDuringPregnancyAndLactation: data.useDuringPregnancyAndLactation,
        adult:
          typeof data.adult === "string"
            ? JSON.parse(data.adult)
            : data.adult || null,
        child:
          typeof data.child === "string"
            ? JSON.parse(data.child)
            : data.child || null,
      },
    });

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(medicine, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      )
    );
  } catch (error) {
    console.error("Error creating medicine", error);
    return NextResponse.json(
      { error: "failed to create medicine" },
      { status: 500 }
    );
  }
}
