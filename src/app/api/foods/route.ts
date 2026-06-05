import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('[API/Foods/GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, description, price, imageUrl } = json;

    const newFood = await prisma.food.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl
      }
    });
    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create food item' }, { status: 500 });
  }
}
