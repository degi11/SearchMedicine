import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Зөвхөн админ хандаж болно!" },
        { status: 403 }
      );
    }

    const data = await req.json();

    if (data.barcode) {
      const existing = await prisma.medicine.findUnique({
        where: { barcode: String(data.barcode) },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Энэ barcode аль хэдийн орсон байна" },
          { status: 400 }
        );
      }
    }

    const medicine = await prisma.medicine.create({
      data: {
        tradeNameMN: data.tradeNameMN,
        tradeNameEN: data.tradeNameEN,
        barcode: data.barcode,
        internationalName: data.internationalName,
        dosage: data.dosage,
        no: data.no ? Number(data.no) : null,
        dosageForm: data.dosageForm,
        conditionsOfIssue: data.conditionsOfIssue,
        country: data.country,
        registered: data.registered,
        indicationsForUse: data.indicationsForUse,
        prohibitionsPrecautions: data.prohibitionsPrecautions,
        sideEffects: data.sideEffects,
        interactionWithOtherDrugs: data.interactionWithOtherDrugs,
        useDuringPregnancyAndLactation: data.useDuringPregnancyAndLactation,
        adult: data.adult,
        child: data.child,
        image: data.image,
      },
    });

    const safeMedicine = {
      ...medicine,
      barcode: medicine.barcode?.toString(),
    };

    return NextResponse.json(safeMedicine);
  } catch (err) {
    console.error("Medicine create error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Эм үүсгэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
