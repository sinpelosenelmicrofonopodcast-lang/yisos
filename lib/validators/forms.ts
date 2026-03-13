import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email()
});

export const pushSubscriptionSchema = z.object({
  subscriptionId: z.string().min(2),
  optedIn: z.boolean()
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  shippingName: z.string().min(2),
  shippingAddress1: z.string().min(4),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingPostalCode: z.string().min(4),
  shippingCountry: z.string().min(2),
  paymentMethod: z.enum(["stripe", "paypal", "manual"])
});
