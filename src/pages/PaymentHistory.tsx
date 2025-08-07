
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      navigate("/");
      return;
    }

    // TODO: Fetch payment history from Supabase
    // For now, simulate with mock data
    setTimeout(() => {
      setPaymentHistory([
        // No payments yet for demo
      ]);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleBack = () => {
    navigate("/application-details");
  };

  const handleDownloadReceipt = (payment: any) => {
    console.log("Downloading receipt for:", payment);
  };

  const handleMakePayment = () => {
    navigate("/payment-options");
  };

  if (isLoading) {
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
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment History</h1>
            <p className="text-muted-foreground">View your payment records and download receipts</p>
          </div>
        </div>

        {/* Payment Status Overview */}
        <Card className="animate-slide-up">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Payments Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">₦0</div>
                <div className="text-sm text-muted-foreground">Total Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">₦40,000</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        {paymentHistory.length === 0 ? (
          <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any payments yet. Start by making your first payment to secure your spot in the program.
              </p>
              <Button onClick={handleMakePayment} className="btn-primary">
                Make Your First Payment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment, index) => (
              <Card key={payment.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{payment.description}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {payment.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success">₦{payment.amount.toLocaleString()}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Button */}
        {paymentHistory.length > 0 && (
          <div className="text-center">
            <Button onClick={handleMakePayment} className="btn-primary">
              Make Another Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
