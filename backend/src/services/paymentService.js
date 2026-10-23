import crypto from "crypto";

/**
 * Simulated payment provider.
 * Swap this module for Razorpay (or another gateway) without changing controllers.
 */
export async function simulatePayment(amount) {
  return {
    status: "completed",
    transactionId: `sim_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`,
    amount,
  };
}
