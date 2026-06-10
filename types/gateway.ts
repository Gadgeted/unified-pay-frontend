// Strict definitions matching your NestJS Prisma schemas

export type PaymentMethod = 'MPESA' | 'AIRTEL' | 'CARD' | 'CRYPTO';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface CreatePaymentDto {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  customerIdentifier: string; // Phone number, wallet address, or token string
  merchantReference: string;
  isSandbox?: boolean;
}

export interface PaymentResponse {
  mode: 'SANDBOX' | 'LIVE';
  message: string;
  transactionId: string;
  gatewayReference?: string;
  checkoutRequestId?: string; // M-Pesa explicit return
  depositAddress?: string;    // Crypto explicit return
  paymentNetwork?: string;    // Crypto explicit return
  instructions?: string;      // Crypto explicit return
  status?: string;
}

export interface DashboardMetrics {
  businessName: string;
  metrics: {
    totalGrossVolume: number;
    platformFeesCollected: number;
    withdrawableBalance: number;
    totalBusinessExpenses: number;
    totalEmployeeSalaries: number;
    netBusinessProfit: number;
  };
  channelVolumeDistribution: {
    mpesa: number;
    airtel: number;
    card: number;
    crypto: number;
  };
  transactionCount: number;
}