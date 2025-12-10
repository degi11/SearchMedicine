import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };

  if (decoded.role !== "ADMIN") {
    throw new Error("Зөвхөн админ хандаж болно!");
  }
}

export async function POST(req: Request) {
  try {
    await verifyAdmin(req);
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
        barcode: data.barcode ? String(data.barcode) : null,
        internationalName: data.internationalName,
        dosage: data.dosage,
        no: data.no ? Number(data.no) : null,
        dosageForm: data.dosageForm,
        conditionsOfIssue: data.conditionsOfIssue,
        country: data.country,
        registered: data.registered,
        storageConditions: data.storageConditions,
        indicationsForUse: data.indicationsForUse,
        prohibitionsPrecautions: data.prohibitionsPrecautions,
        sideEffects: data.sideEffects,
        interactionWithOtherDrugs: data.interactionWithOtherDrugs,
        useDuringPregnancyAndLactation: data.useDuringPregnancyAndLactation,
        doseUsage: data.doseUsage,
        image: data.image,
      },
    });

    return NextResponse.json(medicine);
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

export async function PUT(req: Request) {
  try {
    await verifyAdmin(req);
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "ID илгээгдээгүй байна" },
        { status: 400 }
      );
    }

    const updated = await prisma.medicine.update({
      where: { id: data.id },
      data: {
        tradeNameMN: data.tradeNameMN,
        tradeNameEN: data.tradeNameEN,
        barcode: data.barcode ? String(data.barcode) : null,
        internationalName: data.internationalName,
        dosage: data.dosage,
        no: data.no ? Number(data.no) : null,
        dosageForm: data.dosageForm,
        conditionsOfIssue: data.conditionsOfIssue,
        country: data.country,
        registered: data.registered,
        storageConditions: data.storageConditions,
        indicationsForUse: data.indicationsForUse,
        prohibitionsPrecautions: data.prohibitionsPrecautions,
        sideEffects: data.sideEffects,
        interactionWithOtherDrugs: data.interactionWithOtherDrugs,
        useDuringPregnancyAndLactation: data.useDuringPregnancyAndLactation,
        doseUsage: data.doseUsage,
        image: data.image,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Medicine update error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Эм шинэчлэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await verifyAdmin(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID илгээгдээгүй байна" },
        { status: 400 }
      );
    }

    await prisma.medicine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Medicine delete error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Эм устгахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
