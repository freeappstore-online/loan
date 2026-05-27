export type Currency = "USD" | "EUR" | "GBP" | "AUD";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

export interface LoanInput {
  principal: number;
  annualRate: number;
  termMonths: number;
  extraPayment: number;
  /** Mortgage-specific */
  propertyTax: number;
  homeInsurance: number;
  pmiRate: number;
  downPaymentPercent: number;
  isMortgage: boolean;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principalPortion: number;
  interestPortion: number;
  extraPortion: number;
  remainingBalance: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  /** With extra payments */
  monthlyPaymentWithExtra: number;
  totalInterestWithExtra: number;
  totalPaidWithExtra: number;
  monthsSavedWithExtra: number;
  interestSavedWithExtra: number;
  schedule: AmortizationRow[];
  /** Mortgage extras */
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalMonthlyPITI: number;
}

export interface LoanPreset {
  name: string;
  principal: number;
  annualRate: number;
  termMonths: number;
  isMortgage: boolean;
}

export const PRESETS: LoanPreset[] = [
  { name: "30yr Mortgage", principal: 400000, annualRate: 6.5, termMonths: 360, isMortgage: true },
  { name: "15yr Mortgage", principal: 400000, annualRate: 5.9, termMonths: 180, isMortgage: true },
  { name: "5yr Auto Loan", principal: 35000, annualRate: 7.0, termMonths: 60, isMortgage: false },
  { name: "3yr Personal", principal: 15000, annualRate: 10.5, termMonths: 36, isMortgage: false },
  { name: "10yr Student", principal: 50000, annualRate: 5.5, termMonths: 120, isMortgage: false },
];

export type Tab = "calculator" | "comparison" | "affordability";
