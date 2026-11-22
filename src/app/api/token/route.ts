import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json(
      { message: "Server configuration error: JWT_SECRET is missing" },
      { status: 500 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(jwtSecret);

  const token = await new SignJWT({
    email: session.user.email,
    role: session.user.role || "customer",
    name: session.user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  return NextResponse.json(
    { token },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
