import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ loggedIn: false });

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    return NextResponse.json({
      loggedIn: true,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (err) {
    return NextResponse.json({ loggedIn: false });
  }
}
