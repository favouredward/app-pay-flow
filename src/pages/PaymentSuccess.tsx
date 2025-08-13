
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
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

      try {
        console.log('Starting payment verification for reference:', reference);
        
        // Verify payment immediately with our edge function
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: {
            action: 'verify',
            reference: reference
          }
        });

        console.log('Verification response received:', { data, error });

        if (error) {
          console.error('Verification error:', error);
          throw new Error(error.message || 'Payment verification failed');
        }

        if (data.success && data.verified) {
          console.log('Payment verified successfully');
          
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
            reference: reference,
            timestamp: new Date().toLocaleString(),
            transactionId: data.data.id,
            amount: paymentRecord.amount_paid,
            monthsPaid: paymentRecord.months_paid_for
          });
          
          setVerificationComplete(true);
          toast.success("Payment verified successfully!");

          // Auto-redirect to payment history after 3 seconds
          console.log('Setting up auto-redirect to payment history in 3 seconds');
          setTimeout(() => {
            console.log('Auto-redirecting to payment history');
            navigate("/payment-history");
          }, 3000);

        } else {
          console.error('Payment verification failed:', data);
          throw new Error(data.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error(error instanceof Error ? error.message : "Payment verification failed");
        
        // Redirect to home after 3 seconds on error
        setTimeout(() => {
          console.log('Redirecting to home due to verification error');
          navigate("/");
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    // Start verification immediately
    verifyPayment();
  }, [navigate, searchParams]);

  const handleDownloadReceipt = () => {
    toast.info("Receipt download feature coming soon!");
  };

  const handleViewPaymentHistory = () => {
    navigate("/payment-history");
  };

  const handleBackToPortal = () => {
    navigate("/");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 payment-container">
          <div className="payment-card">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-muted-foreground">Verifying payment...</span>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Please wait while we confirm your payment with Paystack. 
                This should only take a few seconds.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 payment-container">
          <div className="payment-card">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 text-red-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">Payment Verification Failed</h2>
              <p className="text-muted-foreground text-center">
                We couldn't verify your payment. Please contact support at support@blactechafrica.com
              </p>
              <p className="text-sm text-muted-foreground">
                You will be redirected to the home page shortly.
              </p>
            </div>
          </div>
        </div>
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
                    <p className="font-medium">Payment Confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      Your payment has been verified and your application status updated.
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
