
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const email = sessionStorage.getItem("userEmail");
      const storedApplicationData = sessionStorage.getItem("applicationData");
      
      if (!email || !storedApplicationData) {
        navigate("/");
        return;
      }

      try {
        const parsedApplicationData = JSON.parse(storedApplicationData);
        setApplicationData(parsedApplicationData);

        // Set current user email for RLS
        await supabase.rpc('set_config', {
          parameter: 'app.current_user_email',
          value: email
        });

        // Fetch payments for this application
        const { data: payments, error } = await supabase
          .from('payments')
          .select('*')
          .eq('application_id', parsedApplicationData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching payments:', error);
          toast.error('Failed to fetch payment history');
        } else {
          setPaymentHistory(payments || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load payment history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [navigate]);

  const handleBack = () => {
    navigate("/application-details");
  };

  const handleDownloadReceipt = (payment: any) => {
    toast.info("Receipt download feature coming soon!");
    console.log("Downloading receipt for:", payment);
  };

  const handleMakePayment = () => {
    navigate("/payment-options");
  };

  const totalPaid = paymentHistory
    .filter(p => p.payment_status === 'success')
    .reduce((sum, p) => sum + Number(p.amount_paid), 0);

  const remainingBalance = 40000 - totalPaid;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 payment-container">
          <div className="payment-card">
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
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
                  <div className="text-2xl font-bold text-foreground">
                    {paymentHistory.filter(p => p.payment_status === 'success').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Payments Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">₦{totalPaid.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₦{remainingBalance.toLocaleString()}</div>
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
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          payment.payment_status === 'success' 
                            ? 'bg-success/10' 
                            : payment.payment_status === 'pending' 
                              ? 'bg-warning/10' 
                              : 'bg-destructive/10'
                        }`}>
                          <CheckCircle className={`w-6 h-6 ${
                            payment.payment_status === 'success' 
                              ? 'text-success' 
                              : payment.payment_status === 'pending' 
                                ? 'text-warning' 
                                : 'text-destructive'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            Monthly Payment ({payment.months_paid_for} month{payment.months_paid_for > 1 ? 's' : ''})
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status: {payment.payment_status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          payment.payment_status === 'success' ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          ₦{Number(payment.amount_paid).toLocaleString()}
                        </div>
                        {payment.payment_status === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <Button onClick={handleMakePayment} className="btn-primary">
              {paymentHistory.length > 0 ? "Make Another Payment" : "Make Your First Payment"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentHistory;
