
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import PaymentVerificationDialog from "@/components/PaymentVerificationDialog";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    isDialogOpen,
    paymentReference,
    openVerificationDialog,
    closeVerificationDialog,
    handleVerificationComplete,
  } = usePaymentVerification(
    // onSuccess
    (data) => {
      console.log('Payment verification successful:', data);
      
      const paymentRecord = data.paymentRecord;
      const selectedPlan = sessionStorage.getItem("selectedPlan");
      const userEmail = sessionStorage.getItem("userEmail");
      
      // Set payment data for display
      setPaymentData({
        plan: selectedPlan ? JSON.parse(selectedPlan) : { 
          title: `${paymentRecord.months_paid_for} Month(s) Payment`, 
          amount: paymentRecord.amount_paid 
        },
        email: userEmail || paymentRecord.application?.email || 'N/A',
        reference: paymentReference,
        timestamp: new Date().toLocaleString(),
        transactionId: data.data.id,
        amount: paymentRecord.amount_paid,
        monthsPaid: paymentRecord.months_paid_for
      });
      
      setVerificationComplete(true);
      toast.success("Payment verified and database updated successfully!");

      // Auto-redirect to payment history after 3 seconds
      setTimeout(() => {
        console.log('Auto-redirecting to payment history');
        navigate("/payment-history");
      }, 3000);
    },
    // onFailure
    () => {
      toast.error("Payment verification failed. Please contact support.");
      setTimeout(() => {
        console.log('Redirecting to home due to verification error');
        navigate("/");
      }, 3000);
    }
  );

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    console.log('Payment success page loaded');
    console.log('URL search params:', Object.fromEntries(searchParams.entries()));
    console.log('Payment reference from URL:', reference);
    
    if (!reference) {
      console.error("Missing payment reference in URL");
      toast.error("Missing payment reference. Please contact support.");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Open verification dialog immediately
    openVerificationDialog(reference);
  }, [navigate, searchParams, openVerificationDialog]);

  const handleDownloadReceipt = () => {
    toast.info("Receipt download feature coming soon!");
  };

  const handleViewPaymentHistory = () => {
    navigate("/payment-history");
  };

  const handleBackToPortal = () => {
    navigate("/");
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 payment-container">
          <div className="payment-card">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 text-primary">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">Payment Received</h2>
              <p className="text-muted-foreground text-center">
                Your payment was successful! We're now verifying it with our database.
              </p>
            </div>
          </div>
        </div>
        
        <PaymentVerificationDialog
          isOpen={isDialogOpen}
          onClose={closeVerificationDialog}
          paymentReference={paymentReference}
          onVerificationComplete={handleVerificationComplete}
        />
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 payment-container">
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
          {/* Success Header */}
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your payment has been processed and verified successfully
            </p>
            {verificationComplete && (
              <p className="text-sm text-primary mt-2">
                Redirecting to your payment history in 3 seconds...
              </p>
            )}
          </div>

          {/* Payment Details Card */}
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="font-mono font-medium">{paymentData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Reference</span>
                  <span className="font-mono font-medium">{paymentData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-bold text-success">₦{paymentData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Months Paid For</span>
                  <span className="font-medium">{paymentData.monthsPaid} month(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Date</span>
                  <span className="font-medium">{paymentData.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="font-medium">{paymentData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Status</span>
                  <span className="font-medium text-success">✓ Updated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Verified</p>
                    <p className="text-sm text-muted-foreground">
                      Your payment has been verified with Paystack and our database updated.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a payment confirmation email shortly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button
              onClick={handleViewPaymentHistory}
              className="btn-primary w-full"
            >
              View Payment History
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button
              onClick={handleBackToPortal}
              variant="ghost"
              className="w-full"
            >
              Back to Payment Portal
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center pt-6 border-t animate-slide-up" style={{animationDelay: '0.3s'}}>
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:support@blactechafrica.com" className="text-primary hover:underline">
                support@blactechafrica.com
              </a>
              {" "}or call{" "}
              <a href="tel:+2349067090883" className="text-primary hover:underline">
                +2349067090883
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
