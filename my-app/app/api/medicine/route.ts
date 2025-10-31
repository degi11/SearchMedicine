import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "super-secret-key";

function isAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken")?.value;
  return token === ADMIN_SECRET;
}

export async function POST(req: Request) {
  if (!isAdmin())
    return NextResponse.json({ error: "Зөвхөн админ хандаж болно!" }, { status: 403 });

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
        prohibitionsPrecautions: data.prohibitionsPrecautions,
        sideEffects: data.sideEffects,
        interactionWithOtherDrugs: data.interactionWithOtherDrugs,
        useDuringPregnancyAndLactation: data.useDuringPregnancyAndLactation,
        adult: data.adult,
        child: data.child,
        image: data.image,
      },
    });

    return NextResponse.json(medicine);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Эм үүсгэхэд алдаа гарлаа" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin())
    return NextResponse.json({ error: "Зөвхөн админ хандаж болно!" }, { status: 403 });

  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "id байхгүй байна" }, { status: 400 });
    }

    const updated = await prisma.medicine.update({
      where: { id: data.id },
      data: { ...data },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Эм шинэчлэхэд алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin())
    return NextResponse.json({ error: "Зөвхөн админ хандаж болно!" }, { status: 403 });

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id байхгүй байна" }, { status: 400 });
    }

    await prisma.medicine.delete({ where: { id } });
    return NextResponse.json({ message: "Эм устгалаа" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Эм устгахад алдаа гарлаа" }, { status: 500 });
  }
}
