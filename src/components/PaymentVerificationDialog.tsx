
import { useState, useEffect } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PaymentVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentReference: string;
  onVerificationComplete: (success: boolean, data?: any) => void;
}

const PaymentVerificationDialog = ({
  isOpen,
  onClose,
  paymentReference,
  onVerificationComplete,
}: PaymentVerificationDialogProps) => {
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen && paymentReference) {
      verifyPayment();
    }
  }, [isOpen, paymentReference]);

  const verifyPayment = async () => {
    try {
      setVerificationStatus("verifying");
      setError("");

      console.log("Verifying payment with reference:", paymentReference);

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'verify',
          reference: paymentReference
        }
      });

      if (error) {
        console.error('Payment verification error:', error);
        throw new Error(error.message || 'Payment verification failed');
      }

      console.log('Payment verification response:', data);

      if (data.success && data.verified) {
        setVerificationStatus("success");
        setVerificationData(data);
        onVerificationComplete(true, data);
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationStatus("failed");
      setError(error instanceof Error ? error.message : "Payment verification failed");
      onVerificationComplete(false);
    }
  };

  const handleRetryVerification = () => {
    verifyPayment();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {verificationStatus === "verifying" && (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                Verifying Payment
              </>
            )}
            {verificationStatus === "success" && (
              <>
                <CheckCircle className="w-5 h-5 text-success" />
                Payment Verified
              </>
            )}
            {verificationStatus === "failed" && (
              <>
                <AlertCircle className="w-5 h-5 text-destructive" />
                Verification Failed
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {verificationStatus === "verifying" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <Loader2 className="w-full h-full animate-spin text-primary" />
              </div>
              <DialogDescription>
                Please wait while we verify your payment with Paystack and update our database...
              </DialogDescription>
              <p className="text-xs text-muted-foreground">
                Reference: {paymentReference}
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <DialogDescription>
                Your payment has been successfully verified and our database has been updated.
              </DialogDescription>
              {verificationData && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                  <p><strong>Amount:</strong> ₦{(verificationData.data.amount / 100).toLocaleString()}</p>
                  <p><strong>Reference:</strong> {verificationData.data.reference}</p>
                  <p><strong>Status:</strong> <span className="text-success">Verified ✓</span></p>
                </div>
              )}
            </div>
          )}

          {verificationStatus === "failed" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <DialogDescription>
                We couldn't verify your payment at this time. Please try again or contact support.
              </DialogDescription>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {verificationStatus === "failed" && (
            <Button onClick={handleRetryVerification} variant="outline" className="flex-1">
              Try Again
            </Button>
          )}
          <Button 
            onClick={handleClose} 
            className={verificationStatus === "failed" ? "flex-1" : "w-full"}
            variant={verificationStatus === "success" ? "default" : "outline"}
          >
            {verificationStatus === "success" ? "Continue" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentVerificationDialog;
