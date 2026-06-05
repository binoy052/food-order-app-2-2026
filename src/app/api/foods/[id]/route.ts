import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const food = await prisma.food.findUnique({
      where: { id: resolvedParams.id }
    });
    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }
    return NextResponse.json(food);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const json = await request.json();
    const { name, description, price, imageUrl } = json;

    const updatedFood = await prisma.food.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl
      }
    });
    return NextResponse.json(updatedFood);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.food.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ message: 'Food deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
