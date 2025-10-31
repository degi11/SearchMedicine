import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface LoginBody {
  email: string;
  password: string;
}   

export async function POST(req: Request): Promise<Response> {
  try {
    const body: LoginBody = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { email: body.email },
    });
    if (!admin) {
      return Response.json({ message: "No admin found" }, { status: 401 });
    }

    const valid = await bcrypt.compare(body.password, admin.password);
    if (!valid) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in env");
    }

    const token = jwt.sign({ id: admin.id }, secret, { expiresIn: "1d" });

    return Response.json({ message: "Logged in", token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { message: "Server error", error: `${error}` },
      { status: 500 }
    );
  }
}
