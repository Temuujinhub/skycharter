import { haversineKm } from "./distance";

export type PricingInput = {
  from: { lat: number; lng: number; landingFee: number };
  to: { lat: number; lng: number; landingFee: number };
  aircraft: { hourlyRate: number; cruiseSpeed: number };
  emptyLegDiscountPct?: number;
};

export type PricingResult = {
  distanceKm: number;
  flightMinutes: number;
  basePrice: number;
  fees: number;
  discount: number;
  total: number;
};

export function calculateQuote(input: PricingInput): PricingResult {
  const { from, to, aircraft, emptyLegDiscountPct = 0 } = input;
  const distanceKm = Math.round(haversineKm(from, to) * 10) / 10;
  const flightHours = distanceKm / aircraft.cruiseSpeed;
  const flightMinutes = Math.max(15, Math.ceil(flightHours * 60));
  const basePrice = Math.round((flightMinutes / 60) * aircraft.hourlyRate);
  const fees = Math.round(Number(from.landingFee) + Number(to.landingFee));
  const subtotal = basePrice + fees;
  const discount = Math.round((subtotal * emptyLegDiscountPct) / 100);
  const total = subtotal - discount;
  return { distanceKm, flightMinutes, basePrice, fees, discount, total };
}

export function formatUSD(n: number | string): string {
  const num = typeof n === "string" ? Number(n) : n;
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h}ц`;
  return `${h}ц ${m}м`;
}
