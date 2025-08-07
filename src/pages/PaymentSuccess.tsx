
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedPlan = sessionStorage.getItem("selectedPlan");
    const userEmail = sessionStorage.getItem("userEmail");
    
    if (!selectedPlan || !userEmail) {
      navigate("/");
      return;
    }

    // Set payment success data
    setPaymentData({
      plan: JSON.parse(selectedPlan),
      email: userEmail,
      reference: `PST_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  }, [navigate]);

  const handleDownloadReceipt = () => {
    // TODO: Generate PDF receipt
    console.log("Downloading receipt...");
  };

  const handleViewPaymentHistory = () => {
    navigate("/payment-history");
  };

  const handleBackToPortal = () => {
    navigate("/");
  };

  if (!paymentData) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        {/* Success Header */}
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your payment has been processed successfully
          </p>
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
                <span className="font-bold text-success">₦{paymentData.plan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment For</span>
                <span className="font-medium">{paymentData.plan.title}</span>
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
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a payment confirmation email within the next few minutes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Payment Recorded</p>
                  <p className="text-sm text-muted-foreground">
                    Your payment has been recorded and your application status has been updated.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button
            onClick={handleViewPaymentHistory}
            className="btn-primary w-full"
          >
            View Payment History
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={handleBackToPortal}
            variant="ghost"
            className="w-full"
          >
            Back to Payment Portal
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t animate-slide-up" style={{animationDelay: '0.3s'}}>
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:support@yourcompany.com" className="text-primary hover:underline">
              support@yourcompany.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this receipt for your records
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
