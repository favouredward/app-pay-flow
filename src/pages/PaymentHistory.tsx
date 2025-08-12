import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
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

        console.log('Fetching payments for application:', parsedApplicationData.id);

        // Fetch payments for this specific application ID
        const { data: payments, error } = await supabase
          .from('payments')
          .select('*')
          .eq('application_id', parsedApplicationData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching payments:', error);
          toast.error('Failed to fetch payment history');
        } else {
          console.log('Fetched payments:', payments);
          setPaymentHistory(payments || []);
        }

        // Also fetch updated application data to get latest payment status
        const { data: updatedApp, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', parsedApplicationData.id)
          .single();

        if (!appError && updatedApp) {
          setApplicationData(updatedApp);
          // Update session storage with latest data
          sessionStorage.setItem("applicationData", JSON.stringify(updatedApp));
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

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'failed':
        return XCircle;
      case 'pending':
      default:
        return Clock;
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
      default:
        return 'text-yellow-600';
    }
  };

  const getPaymentBgColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100';
      case 'failed':
        return 'bg-red-100';
      case 'pending':
      default:
        return 'bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Successful';
      case 'failed':
        return 'Failed';
      case 'pending':
      default:
        return 'Pending';
    }
  };

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

  const hasAnyPayments = paymentHistory.length > 0;
  const hasSuccessfulPayments = paymentHistory.some(p => p.payment_status === 'success');

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
                  <div className="text-sm text-muted-foreground">Successful Payments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₦{totalPaid.toLocaleString()}</div>
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
          {!hasAnyPayments ? (
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
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              {paymentHistory.map((payment, index) => {
                const PaymentIcon = getPaymentIcon(payment.payment_status);
                return (
                  <Card key={payment.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPaymentBgColor(payment.payment_status)}`}>
                            <PaymentIcon className={`w-6 h-6 ${getPaymentColor(payment.payment_status)}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              Monthly Payment ({payment.months_paid_for} month{payment.months_paid_for > 1 ? 's' : ''})
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                            </p>
                            <p className={`text-xs font-medium ${getPaymentColor(payment.payment_status)}`}>
                              Status: {getStatusText(payment.payment_status)}
                            </p>
                            {payment.paystack_reference && (
                              <p className="text-xs text-muted-foreground">
                                Ref: {payment.paystack_reference}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            payment.payment_status === 'success' ? 'text-green-600' : 
                            payment.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            ₦{Number(payment.amount_paid).toLocaleString()}
                          </div>
                          {payment.payment_status === 'success' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(payment)}
                              className="text-primary hover:text-primary/80 mt-1"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Action Button - Only show if balance remaining and no duplicate logic */}
          {remainingBalance > 0 && hasAnyPayments && (
            <div className="text-center">
              <Button onClick={handleMakePayment} className="btn-primary">
                Make Another Payment
              </Button>
            </div>
          )}

          {/* Show completion message if fully paid */}
          {remainingBalance <= 0 && hasSuccessfulPayments && (
            <Card className="animate-slide-up bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Complete!</h3>
                <p className="text-green-700">
                  Congratulations! You have completed all payments for the program.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentHistory;
