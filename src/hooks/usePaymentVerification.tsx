
import { useState, useCallback } from "react";

interface UsePaymentVerificationReturn {
  isDialogOpen: boolean;
  paymentReference: string;
  openVerificationDialog: (reference: string) => void;
  closeVerificationDialog: () => void;
  handleVerificationComplete: (success: boolean, data?: any) => void;
}

export const usePaymentVerification = (
  onSuccess?: (data: any) => void,
  onFailure?: () => void
): UsePaymentVerificationReturn => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");

  const openVerificationDialog = useCallback((reference: string) => {
    setPaymentReference(reference);
    setIsDialogOpen(true);
  }, []);

  const closeVerificationDialog = useCallback(() => {
    setIsDialogOpen(false);
    setPaymentReference("");
  }, []);

  const handleVerificationComplete = useCallback((success: boolean, data?: any) => {
    if (success) {
      console.log("Payment verification successful:", data);
      onSuccess?.(data);
    } else {
      console.log("Payment verification failed");
      onFailure?.();
    }
  }, [onSuccess, onFailure]);

  return {
    isDialogOpen,
    paymentReference,
    openVerificationDialog,
    closeVerificationDialog,
    handleVerificationComplete,
  };
};
