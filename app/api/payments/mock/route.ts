import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createMockQpayInvoice, mockCardCharge } from "@/lib/qpay-mock";

const schema = z.object({
  bookingId: z.string(),
  method: z.enum(["QPAY", "CARD", "SOCIALPAY", "INVOICE"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { bookingId, method } = parsed.data;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const amount = Number(booking.totalPrice);

  if (method === "QPAY") {
    const { qrCode, txReference } = await createMockQpayInvoice({ amount, bookingCode: booking.bookingCode });
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: { method, status: "PENDING", qrCode, txReference, amount },
      create: { bookingId, method, status: "PENDING", qrCode, txReference, amount },
    });
    return NextResponse.json({ payment });
  }

  if (method === "CARD" || method === "SOCIALPAY") {
    const charge = mockCardCharge();
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: { method, status: "PAID", txReference: charge.reference, paidAt: new Date(), amount },
      create: { bookingId, method, status: "PAID", txReference: charge.reference, paidAt: new Date(), amount },
    });
    await prisma.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
    return NextResponse.json({ payment, confirmed: true });
  }

  // INVOICE
  const payment = await prisma.payment.upsert({
    where: { bookingId },
    update: { method, status: "PENDING", txReference: `INV-${Date.now()}`, amount },
    create: { bookingId, method, status: "PENDING", txReference: `INV-${Date.now()}`, amount },
  });
  await prisma.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
  return NextResponse.json({ payment, confirmed: true });
}

// Mock confirmation endpoint (for QR flow)
export async function PATCH(req: Request) {
  const body = await req.json();
  const { bookingId } = body as { bookingId: string };
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  const payment = await prisma.payment.update({
    where: { bookingId },
    data: { status: "PAID", paidAt: new Date() },
  });
  await prisma.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
  return NextResponse.json({ payment, confirmed: true });
}
