import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { donationApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import { formatCurrency } from "@/utils";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];
const MAX_AMOUNT = 500000;

// Validate donation amount: must be a positive number with at most 2 decimals.
function validateAmount(value) {
  const num = Number(value);
  if (!value || isNaN(num)) return "Please enter a valid amount.";
  if (num < 1) return "Amount must be at least ₹1.";
  if (num > MAX_AMOUNT) return `Amount cannot exceed ${formatCurrency(MAX_AMOUNT)}.`;
  // Check for more than 2 decimal places.
  const str = String(value);
  if (str.includes(".") && str.split(".")[1]?.length > 2) {
    return "Amount cannot have more than 2 decimal places.";
  }
  return null;
}

// Donate modal with preset amounts, custom input, validation, and success state.
export default function DonateModal({ campaign, open, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [amount, setAmount] = useState(1000);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setAmount(1000);
    setError(null);
    setSubmitting(false);
    setSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setError(null);
  };

  const handleSubmit = async () => {
    // Redirect to login if not authenticated.
    if (!isAuthenticated) {
      handleClose();
      navigate("/login");
      return;
    }

    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await donationApi.create({
        userId: user.id,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        amount: Number(amount),
      });
      setSuccess(true);
      toast("Donation successful! Thank you for your generosity.");
      onSuccess?.(Number(amount));
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      toast("Failed to process your donation. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={success ? "Thank you!" : `Donate to ${campaign?.title ?? ""}`}
    >
      {success ? (
        <div className="text-center py-6">
          <CheckCircle2 className="w-14 h-14 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Donation successful!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You donated {formatCurrency(Number(amount))} to this campaign.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Preset amounts */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
              Choose an amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAmountChange(amt)}
                  className={[
                    "py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    Number(amount) === amt
                      ? "bg-teal-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600",
                  ].join(" ")}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
              Or enter a custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 font-medium">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Inline error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            loading={submitting}
            onClick={handleSubmit}
            disabled={!amount || amount <= 0}
          >
            Donate {formatCurrency(Number(amount) || 0)}
          </Button>

          {!isAuthenticated && (
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center">
              You'll be asked to sign in to confirm your donation.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
