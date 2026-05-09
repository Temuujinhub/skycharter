import QRCode from "qrcode";

// Mock QPay payment gateway - generates fake QR + simulates async payment
export async function createMockQpayInvoice(opts: {
  amount: number;
  bookingCode: string;
}): Promise<{ qrCode: string; txReference: string }> {
  const txReference = `QPAY-MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const payload = `qpay://pay?amount=${opts.amount}&ref=${txReference}&booking=${opts.bookingCode}`;
  const qrCode = await QRCode.toDataURL(payload, { width: 320, margin: 1 });
  return { qrCode, txReference };
}

export function mockCardCharge(): { success: boolean; reference: string } {
  return {
    success: true,
    reference: `CARD-MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };
}
