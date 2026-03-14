import { NextResponse } from "next/server";
import { z } from "zod";
import { getShippingQuote } from "@/lib/services/usps-service";
import type { CartItem } from "@/types";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().optional().default(""),
  quantity: z.number().int().positive(),
  stock: z.number().int().nonnegative()
});

const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  shipping: z.object({
    shippingName: z.string().optional(),
    shippingAddress1: z.string().min(4),
    shippingAddress2: z.string().optional(),
    shippingCity: z.string().min(2),
    shippingState: z.string().min(2),
    shippingPostalCode: z.string().min(4),
    shippingCountry: z.string().min(2)
  })
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid shipping quote payload" }, { status: 400 });
  }

  try {
    const quote = await getShippingQuote({
      items: parsed.data.items as CartItem[],
      subtotal: parsed.data.subtotal,
      address: parsed.data.shipping
    });

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to calculate USPS shipping."
      },
      { status: 400 }
    );
  }
}
