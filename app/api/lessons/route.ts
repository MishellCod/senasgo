import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { lessons } from "@/db/schema";

import { asc } from "drizzle-orm";

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.lessons.findMany({
    orderBy: [asc(lessons.order), asc(lessons.id)]
  });

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.insert(lessons).values({
    ...body,
  }).returning();

  return NextResponse.json(data[0]);
};
