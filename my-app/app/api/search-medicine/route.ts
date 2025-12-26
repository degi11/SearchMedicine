import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();
    const barcodeParam = searchParams.get("barcode")?.trim();

    let barcodeString: string | undefined;

    if (barcodeParam && barcodeParam !== "") {
      barcodeString = barcodeParam;
    }

    const where: any = { OR: [] };

    if (q) {
      where.OR.push({
        OR: [
          { tradeNameMN: { contains: q, mode: "insensitive" } },
          { tradeNameEN: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    if (barcodeString) {
      where.OR.push({ barcode: barcodeString });
    }

    if (!where.OR.length) return NextResponse.json([]);

    const medicines = await prisma.medicine.findMany({
      where,
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
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(medicines);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
