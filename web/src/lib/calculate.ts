import type { LoanInput, LoanResult, AmortizationRow } from "./types";

/**
 * Standard amortization formula:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * where r = monthly rate, n = number of months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return principal / termMonths;

  const r = annualRate / 100 / 12;
  const n = termMonths;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Calculate maximum affordable loan amount given a monthly budget.
 * Rearranged: P = M * [(1+r)^n - 1] / [r(1+r)^n]
 */
export function calculateMaxLoan(
  monthlyBudget: number,
  annualRate: number,
  termMonths: number,
): number {
  if (monthlyBudget <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return monthlyBudget * termMonths;

  const r = annualRate / 100 / 12;
  const n = termMonths;
  const factor = Math.pow(1 + r, n);
  return (monthlyBudget * (factor - 1)) / (r * factor);
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths, extraPayment, isMortgage } = input;

  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const r = annualRate > 0 ? annualRate / 100 / 12 : 0;

  // Mortgage extras
  const monthlyPropertyTax = isMortgage ? input.propertyTax / 12 : 0;
  const monthlyInsurance = isMortgage ? input.homeInsurance / 12 : 0;
  const needsPMI = isMortgage && input.downPaymentPercent < 20;
  const monthlyPMI = needsPMI ? (principal * (input.pmiRate / 100)) / 12 : 0;

  // Build amortization schedule with extra payments
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;

  for (let month = 1; month <= termMonths && balance > 0.005; month++) {
    const interestPortion = balance * r;
    let principalPortion = monthlyPayment - interestPortion;
    let extra = Math.min(extraPayment, balance - principalPortion);
    if (extra < 0) extra = 0;

    // Last payment adjustment
    if (principalPortion + extra > balance) {
      principalPortion = balance;
      extra = 0;
    }

    const payment = principalPortion + interestPortion + extra;
    balance = Math.max(0, balance - principalPortion - extra);
    totalPrincipalPaid += principalPortion + extra;
    totalInterestPaid += interestPortion;

    schedule.push({
      month,
      payment: Math.round(payment * 100) / 100,
      principalPortion: Math.round(principalPortion * 100) / 100,
      interestPortion: Math.round(interestPortion * 100) / 100,
      extraPortion: Math.round(extra * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
      totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    });
  }

  const totalWithoutExtra = monthlyPayment * termMonths;
  const totalInterestWithoutExtra = totalWithoutExtra - principal;

  const totalPaidWithExtra = totalInterestPaid + principal;
  const actualMonths = schedule.length;
  const monthsSaved = termMonths - actualMonths;
  const interestSaved = totalInterestWithoutExtra - totalInterestPaid;

  const totalMonthlyPITI = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterestWithoutExtra * 100) / 100,
    totalPaid: Math.round(totalWithoutExtra * 100) / 100,
    monthlyPaymentWithExtra: Math.round((monthlyPayment + extraPayment) * 100) / 100,
    totalInterestWithExtra: Math.round(totalInterestPaid * 100) / 100,
    totalPaidWithExtra: Math.round(totalPaidWithExtra * 100) / 100,
    monthsSavedWithExtra: monthsSaved,
    interestSavedWithExtra: Math.round(interestSaved * 100) / 100,
    schedule,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyPMI: Math.round(monthlyPMI * 100) / 100,
    totalMonthlyPITI: Math.round(totalMonthlyPITI * 100) / 100,
  };
}
