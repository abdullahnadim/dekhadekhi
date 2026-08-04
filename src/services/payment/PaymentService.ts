// Payment Service — Abstract Factory Pattern
// Swap in real gateways by implementing IPaymentGateway

import type { Payment, PaymentGateway } from "@/types";

export interface InitPaymentResult {
  gatewayUrl: string;
  transactionId: string;
}

export interface VerifyPaymentResult {
  isValid: boolean;
  amount: number;
  currency: string;
  status: "COMPLETED" | "FAILED" | "PENDING";
  gatewayResponse: Record<string, unknown>;
}

// ─── Payment Gateway Interface ────────────────────────────

export interface IPaymentGateway {
  readonly name: PaymentGateway;
  readonly isLive: boolean;

  initialize(params: {
    transactionId: string;
    amount: number;
    currency: string;
    bookingId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
    ipnUrl: string;
  }): Promise<InitPaymentResult>;

  verify(params: {
    transactionId: string;
    validationId?: string;
  }): Promise<VerifyPaymentResult>;

  refund(params: {
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<{ success: boolean; refundId?: string }>;
}

// ─── SSLCommerz Gateway ───────────────────────────────────

export class SSLCommerzGateway implements IPaymentGateway {
  readonly name: PaymentGateway = "SSLCOMMERZ";
  readonly isLive: boolean;

  private storeId: string;
  private storePassword: string;

  constructor() {
    this.storeId = process.env.SSLCOMMERZ_STORE_ID || "";
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "";
    this.isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
  }

  async initialize(params: Parameters<IPaymentGateway["initialize"]>[0]): Promise<InitPaymentResult> {
    if (!this.storeId || !this.storePassword) {
      throw new Error("SSLCommerz credentials not configured");
    }

    // Dynamic import to avoid issues in edge runtime
    const SSLCommerzPayment = (await import("sslcommerz-lts")).default;

    const sslData = {
      total_amount: params.amount.toString(),
      currency: params.currency || "BDT",
      tran_id: params.transactionId,
      success_url: params.successUrl,
      fail_url: params.failUrl,
      cancel_url: params.cancelUrl,
      ipn_url: params.ipnUrl,
      cus_name: params.customerName,
      cus_email: params.customerEmail,
      cus_phone: params.customerPhone || "01700000000",
      cus_add1: "Dhaka, Bangladesh",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      product_name: params.productName,
      product_category: "Entertainment",
      product_profile: "general",
      num_of_item: 1,
      shipping_method: "NO",
      ship_name: params.customerName,
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_country: "Bangladesh",
    };

    const sslcommerz = new SSLCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive
    );

    const response = await sslcommerz.init(sslData as Record<string, unknown>);

    if (!response?.GatewayPageURL) {
      throw new Error("Failed to get gateway URL from SSLCommerz");
    }

    return {
      gatewayUrl: response.GatewayPageURL as string,
      transactionId: params.transactionId,
    };
  }

  async verify(params: { transactionId: string; validationId?: string }): Promise<VerifyPaymentResult> {
    if (!params.validationId) {
      return {
        isValid: false,
        amount: 0,
        currency: "BDT",
        status: "FAILED",
        gatewayResponse: {},
      };
    }

    const SSLCommerzPayment = (await import("sslcommerz-lts")).default;
    const sslcommerz = new SSLCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive
    );

    const response = await sslcommerz.validate({
      val_id: params.validationId,
    });

    const isValid = response?.status === "VALID" || response?.status === "VALIDATED";

    return {
      isValid,
      amount: parseFloat((response?.amount as string) || "0"),
      currency: (response?.currency as string) || "BDT",
      status: isValid ? "COMPLETED" : "FAILED",
      gatewayResponse: response as Record<string, unknown>,
    };
  }

  async refund(_params: { transactionId: string; amount: number; reason: string }) {
    // SSLCommerz refund implementation
    // Requires additional API integration
    return { success: false };
  }
}

// ─── bKash Gateway ────────────────────────────────────────

export class BkashGateway implements IPaymentGateway {
  readonly name: PaymentGateway = "BKASH";
  readonly isLive: boolean;

  constructor() {
    this.isLive = process.env.BKASH_IS_LIVE === "true";
  }

  async initialize(params: Parameters<IPaymentGateway["initialize"]>[0]): Promise<InitPaymentResult> {
    // TODO: Implement bKash PGW API integration
    // Docs: https://developer.bka.sh/
    throw new Error("bKash integration pending merchant credentials");
  }

  async verify(_params: { transactionId: string; validationId?: string }): Promise<VerifyPaymentResult> {
    throw new Error("bKash verification pending implementation");
  }

  async refund(_params: { transactionId: string; amount: number; reason: string }) {
    return { success: false };
  }
}

// ─── Mock Gateway (Development) ──────────────────────────

export class MockPaymentGateway implements IPaymentGateway {
  readonly name: PaymentGateway = "SSLCOMMERZ"; // Using SSLCommerz type for mock
  readonly isLive = false;

  async initialize(params: Parameters<IPaymentGateway["initialize"]>[0]): Promise<InitPaymentResult> {
    // Simulate payment page URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return {
      gatewayUrl: `${baseUrl}/api/payment/mock/process?tran_id=${params.transactionId}&amount=${params.amount}`,
      transactionId: params.transactionId,
    };
  }

  async verify(params: { transactionId: string }): Promise<VerifyPaymentResult> {
    // Always succeed in development
    return {
      isValid: true,
      amount: 0,
      currency: "BDT",
      status: "COMPLETED",
      gatewayResponse: { tran_id: params.transactionId, status: "VALID" },
    };
  }

  async refund(_params: Parameters<IPaymentGateway["refund"]>[0]) {
    return { success: true, refundId: "mock-refund-123" };
  }
}

// ─── Payment Gateway Factory ──────────────────────────────

export type SupportedGateway = "sslcommerz" | "bkash" | "mock";

export function createPaymentGateway(gateway: SupportedGateway): IPaymentGateway {
  const usePayments = process.env.NEXT_PUBLIC_FEATURE_PAYMENTS === "true";

  if (!usePayments) {
    return new MockPaymentGateway();
  }

  switch (gateway) {
    case "sslcommerz":
      return new SSLCommerzGateway();
    case "bkash":
      return new BkashGateway();
    case "mock":
    default:
      return new MockPaymentGateway();
  }
}

// ─── Payment Service ──────────────────────────────────────

export class PaymentService {
  private gateway: IPaymentGateway;

  constructor(gateway: SupportedGateway = "sslcommerz") {
    this.gateway = createPaymentGateway(gateway);
  }

  async initializePayment(params: {
    bookingId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    movieTitle: string;
  }): Promise<InitPaymentResult> {
    const { v4: uuidv4 } = await import("uuid");
    const transactionId = uuidv4();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return this.gateway.initialize({
      transactionId,
      amount: params.amount,
      currency: "BDT",
      bookingId: params.bookingId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone || "01700000000",
      productName: `CineHub BD — ${params.movieTitle}`,
      successUrl: `${baseUrl}/api/payment/success`,
      failUrl: `${baseUrl}/api/payment/fail`,
      cancelUrl: `${baseUrl}/api/payment/cancel`,
      ipnUrl: `${baseUrl}/api/payment/ipn`,
    });
  }

  async verifyPayment(transactionId: string, validationId?: string): Promise<VerifyPaymentResult> {
    return this.gateway.verify({ transactionId, validationId });
  }

  async refundPayment(transactionId: string, amount: number, reason: string) {
    return this.gateway.refund({ transactionId, amount, reason });
  }
}
