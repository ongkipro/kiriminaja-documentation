// kiriminaja-client.ts — Community TypeScript client for KiriminAja API
//
// Server-only. Never import this in browser/client code.
// Requires: Node.js 18+ (native fetch), Bun, or Deno.
//
// Usage:
//   import { KiriminAjaClient } from "./kiriminaja-client";
//   const ka = new KiriminAjaClient({ apiKey: process.env.KA_API_KEY! });
//   const provinces = await ka.address.provinces();

const SANDBOX_BASE = "https://tdev.kiriminaja.com";
const PRODUCTION_BASE = "https://client.kiriminaja.com";

type Env = "sandbox" | "production";

interface ClientConfig {
  apiKey: string;
  env?: Env;
  baseUrl?: string;
  fetch?: typeof fetch;
}

interface ApiResponse<T = unknown> {
  status: boolean;
  text?: string;
  method?: string;
  datas?: T;
  data?: T;
  results?: T;
  details?: T;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class KiriminAjaClient {
  private baseUrl: string;
  private apiKey: string;
  private fetcher: typeof fetch;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.fetcher = config.fetch ?? globalThis.fetch;

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl.replace(/\/$/, "");
    } else {
      this.baseUrl = config.env === "production" ? PRODUCTION_BASE : SANDBOX_BASE;
    }
  }

  private async request<T = unknown>(
    path: string,
    options: {
      method?: string;
      body?: unknown;
      params?: Record<string, string | number>;
    } = {},
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) =>
        url.searchParams.set(k, String(v)),
      );
    }

    const res = await this.fetcher(url.toString(), {
      method: options.method ?? "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : "{}",
    });

    return res.json() as Promise<ApiResponse<T>>;
  }

  // -----------------------------------------------------------------------
  // Address / Coverage Area
  // -----------------------------------------------------------------------

  address = {
    provinces: () => this.request("coverage-area/province"),

    cities: (provinceId: number) =>
      this.request("coverage-area/city", { body: { provinsi_id: provinceId } }),

    districts: (cityId: number) =>
      this.request("coverage-area/district", { body: { kabupaten_id: cityId } }),

    subDistricts: (districtId: number) =>
      this.request("coverage-area/sub-district", { body: { kecamatan_id: districtId } }),

    districtsByName: (keyword: string) =>
      this.request("coverage-area/district-by-name", { body: { keyword } }),

    subDistrictsByName: (keyword: string) =>
      this.request("coverage-area/subdistrict-by-name", { body: { keyword } }),
  };

  // -----------------------------------------------------------------------
  // Pricing
  // -----------------------------------------------------------------------

  pricing = {
    express: (payload: {
      origin_id: number;
      destination_id: number;
      courier?: string | string[];
      weight?: number;
      item_value?: number;
      insurance?: number;
      COD_AMOUNT?: number;
    }) =>
      this.request("pricing/express", {
        body: {
          origin_id: payload.origin_id,
          destination_id: payload.destination_id,
          courier: Array.isArray(payload.courier) ? payload.courier : (payload.courier ?? "all"),
          weight: payload.weight ?? 1000,
          item_value: payload.item_value ?? 0,
          insurance: payload.insurance ?? 0,
          ...(payload.COD_AMOUNT ? { COD_AMOUNT: payload.COD_AMOUNT } : {}),
        },
      }),

    instant: (payload: {
      service: string[];
      item_price: number;
      origin: { lat: number; long: number; address: string };
      destination: { lat: number; long: number; address: string };
      weight?: number;
      vehicle?: "motor" | "mobil";
      timezone?: string;
    }) =>
      this.request("pricing/instant", {
        body: {
          service: payload.service,
          item_price: payload.item_price,
          origin: payload.origin,
          destination: payload.destination,
          weight: payload.weight ?? 1000,
          vehicle: payload.vehicle ?? "motor",
          timezone: payload.timezone ?? "Asia/Jakarta",
        },
      }),
  };

  // -----------------------------------------------------------------------
  // Order — Express
  // -----------------------------------------------------------------------

  order = {
    express: {
      create: (payload: Record<string, unknown>) =>
        this.request("order/express", { body: payload }),

      track: (orderId?: string, awb?: string) =>
        this.request("order/tracking", {
          method: "GET",
          params: {
            ...(orderId ? { order_id: orderId } : {}),
            ...(awb ? { awb } : {}),
          },
        }),

      cancel: (awb: string, reason?: string) =>
        this.request("order/void", {
          body: { awb, reason: reason ?? "canceled by system" },
        }),
    },

    instant: {
      create: (payload: Record<string, unknown>) =>
        this.request("order/instant", { body: payload }),

      track: (orderId: string) =>
        this.request("order/tracking-instant", {
          method: "GET",
          params: { order_id: orderId },
        }),

      cancel: (orderId: string) =>
        this.request("order/void-instant", { body: { order_id: orderId } }),
    },
  };

  // -----------------------------------------------------------------------
  // Pickup
  // -----------------------------------------------------------------------

  pickup = {
    schedules: () => this.request("pickup/schedule"),
  };

  // -----------------------------------------------------------------------
  // Webhooks
  // -----------------------------------------------------------------------

  webhook = {
    register: (url: string) =>
      this.request("webhook/setup", { body: { url } }),
  };

  // -----------------------------------------------------------------------
  // Payment
  // -----------------------------------------------------------------------

  payment = {
    getPayment: (paymentId: string) =>
      this.request("payment", { body: { payment_id: paymentId } }),

    creditBalance: () =>
      this.request("payment/ka-credit"),

    validatePin: (pin: string) =>
      this.request("payment/pin-validation", { body: { pin } }),
  };

  // -----------------------------------------------------------------------
  // Utilities
  // -----------------------------------------------------------------------

  courier = {
    list: () => this.request("others/courier-list"),
    groups: () => this.request("others/courier-group"),
    detail: (code: string) =>
      this.request("others/courier-detail", { body: { courier_code: code } }),
    setPreference: (services: string[]) =>
      this.request("others/set-preference", { body: { services } }),
  };
}

export default KiriminAjaClient;
