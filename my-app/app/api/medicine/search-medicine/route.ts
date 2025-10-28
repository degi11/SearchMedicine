import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();
    const barcodeParam = searchParams.get("barcode")?.trim();

    let barcodeBigInt: bigint | undefined;
    if (barcodeParam) {
      try {
        barcodeBigInt = BigInt(barcodeParam);
      } catch {
        barcodeBigInt = undefined; 
      }
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

    if (barcodeBigInt) {
      where.OR.push({ barcode: barcodeBigInt });
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
        image: true,
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
