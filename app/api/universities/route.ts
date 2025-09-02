import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "Turkey";

  const res = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
  const data = await res.json();
  return NextResponse.json(data);
}
