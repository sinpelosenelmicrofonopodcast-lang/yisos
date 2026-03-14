import type { CartItem } from "@/types";

const USPS_API_BASE_URL = process.env.USPS_API_BASE_URL || "https://apis.usps.com";
const DEFAULT_FALLBACK_SHIPPING_RATE = 18;
const DEFAULT_FREE_SHIPPING_THRESHOLD = 180;
const DEFAULT_ITEM_WEIGHT_OZ = 2;
const DEFAULT_PACKAGING_WEIGHT_OZ = 4;
const DEFAULT_PACKAGE_LENGTH_IN = 10;
const DEFAULT_PACKAGE_WIDTH_IN = 7;
const DEFAULT_PACKAGE_HEIGHT_IN = 2.5;
const DEFAULT_HEIGHT_PER_ITEM_IN = 0.12;

type FetchInit = RequestInit & { retryOnUnauthorized?: boolean };

interface OAuthResponse {
  access_token: string;
  expires_in: string;
}

export interface CheckoutShippingAddress {
  shippingName?: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

export interface UspsAddressResponse {
  firm?: string | null;
  address: {
    streetAddress?: string | null;
    streetAddressAbbreviation?: string | null;
    secondaryAddress?: string | null;
    cityAbbreviation?: string | null;
    city?: string | null;
    state?: string | null;
    ZIPCode?: string | null;
    ZIPPlus4?: string | null;
    urbanization?: string | null;
    postalCode?: string | null;
    province?: string | null;
    country?: string | null;
    countryISOCode?: string | null;
  };
  additionalInfo?: {
    deliveryPoint?: string | null;
    carrierRoute?: string | null;
    DPVConfirmation?: string | null;
    DPVCMRA?: string | null;
    business?: string | null;
    centralDeliveryPoint?: string | null;
    vacant?: string | null;
  } | null;
  corrections?: Array<{ code?: string | null; text?: string | null }> | null;
  matches?: Array<{ code?: string | null; text?: string | null }> | null;
  warnings?: string[] | null;
}

interface UspsRate {
  SKU?: string;
  description?: string;
  priceType?: string;
  price?: number;
  weight?: number;
  dimWeight?: number | null;
  fees?: Array<{ name?: string; SKU?: string; price?: number }> | null;
  startDate?: string;
  endDate?: string;
  warnings?: string[] | null;
  mailClass?: string;
  zone?: string | null;
}

interface UspsRateOption {
  totalBasePrice?: number;
  totalPrice?: number;
  rates?: UspsRate[] | null;
  extraServices?: Array<{ extraService?: string; name?: string; price?: number; SKU?: string; warnings?: string[] | null }> | null;
}

interface UspsBaseRatesResponse {
  totalBasePrice?: number;
  rates?: UspsRate[] | null;
}

interface UspsTotalRatesResponse {
  rateOptions?: UspsRateOption[] | null;
}

export interface ShippingQuote {
  configured: boolean;
  carrier: "USPS" | "Fallback";
  serviceName: string;
  mailClass: string;
  shippingAmount: number;
  carrierAmount: number;
  handlingAmount: number;
  totalAmount: number;
  freeShippingApplied: boolean;
  warnings: string[];
  packageDetails: {
    weight: number;
    length: number;
    width: number;
    height: number;
    itemCount: number;
  };
  addressValidation: UspsAddressResponse | null;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function normalizeZip(zip: string) {
  return zip.replace(/[^0-9]/g, "").slice(0, 5);
}

function isUspsConfigured() {
  return Boolean(
    process.env.USPS_CLIENT_ID &&
      process.env.USPS_CLIENT_SECRET &&
      process.env.USPS_ORIGIN_ZIP &&
      process.env.USPS_ACCOUNT_TYPE &&
      process.env.USPS_ACCOUNT_NUMBER
  );
}

function getFreeShippingThreshold() {
  return parseNumber(process.env.FREE_SHIPPING_THRESHOLD, DEFAULT_FREE_SHIPPING_THRESHOLD);
}

function getHandlingFee() {
  return parseNumber(process.env.USPS_HANDLING_FEE, 0);
}

function buildFallbackQuote(subtotal: number): ShippingQuote {
  const freeShippingApplied = subtotal >= getFreeShippingThreshold();
  const shippingAmount = freeShippingApplied ? 0 : DEFAULT_FALLBACK_SHIPPING_RATE;
  const handlingAmount = getHandlingFee();

  return {
    configured: false,
    carrier: "Fallback",
    serviceName: "Standard Shipping",
    mailClass: "STANDARD",
    shippingAmount: roundCurrency(shippingAmount),
    carrierAmount: roundCurrency(DEFAULT_FALLBACK_SHIPPING_RATE),
    handlingAmount: roundCurrency(handlingAmount),
    totalAmount: roundCurrency(shippingAmount + handlingAmount),
    freeShippingApplied,
    warnings: ["USPS is not configured in the environment. Using fallback checkout rates."],
    packageDetails: {
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      itemCount: 0
    },
    addressValidation: null
  };
}

function getPackageDetails(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemWeightOz = parseNumber(process.env.USPS_DEFAULT_ITEM_WEIGHT_OZ, DEFAULT_ITEM_WEIGHT_OZ);
  const packagingWeightOz = parseNumber(process.env.USPS_PACKAGING_WEIGHT_OZ, DEFAULT_PACKAGING_WEIGHT_OZ);
  const baseHeight = parseNumber(process.env.USPS_PACKAGE_HEIGHT_IN, DEFAULT_PACKAGE_HEIGHT_IN);
  const extraHeightPerItem = parseNumber(process.env.USPS_PACKAGE_HEIGHT_PER_ITEM_IN, DEFAULT_HEIGHT_PER_ITEM_IN);

  return {
    itemCount,
    weight: Number(Math.max(packagingWeightOz + itemCount * itemWeightOz, 1).toFixed(2)),
    length: Number(parseNumber(process.env.USPS_PACKAGE_LENGTH_IN, DEFAULT_PACKAGE_LENGTH_IN).toFixed(2)),
    width: Number(parseNumber(process.env.USPS_PACKAGE_WIDTH_IN, DEFAULT_PACKAGE_WIDTH_IN).toFixed(2)),
    height: Number((baseHeight + Math.max(itemCount - 1, 0) * extraHeightPerItem).toFixed(2))
  };
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(`${USPS_API_BASE_URL}/oauth2/v3/token`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.USPS_CLIENT_ID,
      client_secret: process.env.USPS_CLIENT_SECRET,
      grant_type: "client_credentials"
    })
  });

  const data = (await response.json().catch(() => null)) as OAuthResponse | null;

  if (!response.ok || !data?.access_token) {
    throw new Error("Unable to authenticate with USPS OAuth.");
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 0) * 1000
  };

  return data.access_token;
}

async function uspsFetch<T>(path: string, init?: FetchInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${USPS_API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {})
    }
  });

  if (response.status === 401 && init?.retryOnUnauthorized !== false) {
    cachedToken = null;
    return uspsFetch<T>(path, { ...init, retryOnUnauthorized: false });
  }

  const data = (await response.json().catch(() => null)) as T | { message?: string; error_description?: string } | null;
  const dataRecord = typeof data === "object" && data !== null ? data as { message?: string; error_description?: string } : null;

  if (!response.ok) {
    const message =
      dataRecord?.message ||
      dataRecord?.error_description ||
      `USPS request failed with ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export async function validateUspsAddress(address: CheckoutShippingAddress) {
  if (address.shippingCountry.toUpperCase() !== "US") {
    throw new Error("USPS rating is currently only enabled for US shipping addresses.");
  }

  const params = new URLSearchParams({
    streetAddress: address.shippingAddress1.trim(),
    city: address.shippingCity.trim(),
    state: address.shippingState.trim().toUpperCase(),
    ZIPCode: normalizeZip(address.shippingPostalCode)
  });

  if (address.shippingAddress2?.trim()) {
    params.set("secondaryAddress", address.shippingAddress2.trim());
  }

  return uspsFetch<UspsAddressResponse>(`/addresses/v3/address?${params.toString()}`);
}

function pickBestRate(totalRates: UspsTotalRatesResponse | null, baseRates: UspsBaseRatesResponse | null) {
  const totalRateOptions = totalRates?.rateOptions?.filter((option) => typeof option.totalPrice === "number") || [];
  const bestTotal = totalRateOptions.sort((a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0))[0];

  if (bestTotal) {
    const rate = bestTotal.rates?.[0];

    return {
      serviceName: rate?.description || "USPS Shipping",
      mailClass: rate?.mailClass || process.env.USPS_MAIL_CLASS || "USPS_GROUND_ADVANTAGE",
      carrierAmount: Number(bestTotal.totalPrice || 0),
      warnings: [
        ...(rate?.warnings || []),
        ...(bestTotal.extraServices?.flatMap((service) => service.warnings || []) || [])
      ]
    };
  }

  const bestBase = baseRates?.rates?.filter((rate) => typeof rate.price === "number").sort((a, b) => Number(a.price || 0) - Number(b.price || 0))[0];

  if (bestBase) {
    return {
      serviceName: bestBase.description || "USPS Shipping",
      mailClass: bestBase.mailClass || process.env.USPS_MAIL_CLASS || "USPS_GROUND_ADVANTAGE",
      carrierAmount: Number(bestBase.price || baseRates?.totalBasePrice || 0),
      warnings: bestBase.warnings || []
    };
  }

  throw new Error("USPS returned no eligible shipping rates for this address.");
}

export async function getShippingQuote({
  items,
  subtotal,
  address
}: {
  items: CartItem[];
  subtotal: number;
  address: CheckoutShippingAddress;
}): Promise<ShippingQuote> {
  if (!items.length) {
    throw new Error("Cart is empty.");
  }

  if (!isUspsConfigured()) {
    return buildFallbackQuote(subtotal);
  }

  const validatedAddress = await validateUspsAddress(address);
  const packageDetails = getPackageDetails(items);
  const today = new Date().toISOString().slice(0, 10);
  const ratePayload: Record<string, string | number> = {
    originZIPCode: normalizeZip(process.env.USPS_ORIGIN_ZIP || ""),
    destinationZIPCode: normalizeZip(validatedAddress.address.ZIPCode || address.shippingPostalCode),
    weight: packageDetails.weight,
    length: packageDetails.length,
    width: packageDetails.width,
    height: packageDetails.height,
    mailClass: process.env.USPS_MAIL_CLASS || "USPS_GROUND_ADVANTAGE",
    processingCategory: process.env.USPS_PROCESSING_CATEGORY || "MACHINABLE",
    destinationEntryFacilityType: process.env.USPS_DESTINATION_ENTRY_FACILITY_TYPE || "NONE",
    priceType: process.env.USPS_PRICE_TYPE || "RETAIL",
    accountType: process.env.USPS_ACCOUNT_TYPE || "EPS",
    accountNumber: process.env.USPS_ACCOUNT_NUMBER || "",
    mailingDate: today
  };

  if (process.env.USPS_RATE_INDICATOR) {
    ratePayload.rateIndicator = process.env.USPS_RATE_INDICATOR;
  }

  let totalRates: UspsTotalRatesResponse | null = null;
  let baseRates: UspsBaseRatesResponse | null = null;

  try {
    totalRates = await uspsFetch<UspsTotalRatesResponse>("/prices/v3/total-rates/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ratePayload)
    });
  } catch {
    baseRates = await uspsFetch<UspsBaseRatesResponse>("/prices/v3/base-rates/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ratePayload)
    });
  }

  const pickedRate = pickBestRate(totalRates, baseRates);
  const freeShippingApplied = subtotal >= getFreeShippingThreshold();
  const carrierAmount = roundCurrency(pickedRate.carrierAmount);
  const shippingAmount = roundCurrency(freeShippingApplied ? 0 : carrierAmount);
  const handlingAmount = roundCurrency(getHandlingFee());

  return {
    configured: true,
    carrier: "USPS",
    serviceName: pickedRate.serviceName,
    mailClass: pickedRate.mailClass,
    shippingAmount,
    carrierAmount,
    handlingAmount,
    totalAmount: roundCurrency(shippingAmount + handlingAmount),
    freeShippingApplied,
    warnings: [
      ...(validatedAddress.warnings || []),
      ...(validatedAddress.corrections?.map((correction) => correction.text || "").filter(Boolean) || []),
      ...pickedRate.warnings.filter(Boolean)
    ],
    packageDetails,
    addressValidation: validatedAddress
  };
}
