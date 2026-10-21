import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();
    const barcode = searchParams.get("barcode")?.trim();

    if (!q && !barcode) {
      return NextResponse.json([]);
    }

    let medicines;

    if (barcode) {
      medicines = await prisma.medicine.findMany({
        where: { barcode },
        select: {
          id: true,
          tradeNameMN: true,
          tradeNameEN: true,
          dosage: true,
          no: true,
          dosageForm: true,
          registered: true,
          country: true,
          storageConditions: true,
          imageUrl: true,
        },
        take: 30,
      });
    } else {
      medicines = await prisma.medicine.findMany({
        where: {
          OR: [
            { tradeNameMN: { contains: q!, mode: "insensitive" } },
            { tradeNameEN: { contains: q!, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          tradeNameMN: true,
          tradeNameEN: true,
          dosage: true,
          no: true,
          dosageForm: true,
          registered: true,
          country: true,
          storageConditions: true,
          imageUrl: true,
        },
        take: 30,
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(medicines);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}