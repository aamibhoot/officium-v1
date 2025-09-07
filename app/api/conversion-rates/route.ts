
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized API_ERROR_0x6001" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const yearmonth = searchParams.get("yearmonth");
  const current = searchParams.get("current");

  try {
    if (current) {
      const rate = await prisma.conversionRate.findFirst({
        orderBy: {
          month: "desc",
        },
        include: {
          user: true,
        },
      });
      return NextResponse.json(rate);
    }

    if (yearmonth) {
      const year = parseInt(yearmonth.substring(0, 4));
      const month = parseInt(yearmonth.substring(4, 6));
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const rate = await prisma.conversionRate.findFirst({
        where: {
          month: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          month: "desc",
        },
        include: {
          user: true,
        },
      });
      return NextResponse.json(rate);
    }

    const rates = await prisma.conversionRate.findMany({
      orderBy: {
       month: "desc",
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(rates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized API_ERROR_0x6201" }, { status: 401 });
  }

  try {
    const { rate, month } = await req.json();
    if (!rate || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRate = await prisma.conversionRate.create({
      data: {
        rate,
        month,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newRate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
