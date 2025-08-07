
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const PaymentProcessing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const planData = sessionStorage.getItem("selectedPlan");
    const email = sessionStorage.getItem("userEmail");
    
    if (!planData || !email) {
      navigate("/");
      return;
    }
    
    setSelectedPlan(JSON.parse(planData));
  }, [navigate]);

  const handleBack = () => {
    navigate("/payment-options");
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    
    try {
      const email = sessionStorage.getItem("userEmail");
      const applicationData = sessionStorage.getItem("applicationData");
      
      if (!email || !applicationData) {
        throw new Error("Missing application data");
      }

      const parsedApplicationData = JSON.parse(applicationData);
      
      // Initialize payment with Paystack
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'initialize',
          email: email,
          amount: selectedPlan.amount,
          applicationId: parsedApplicationData.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to initialize payment');
      }

      if (data.success && data.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('Failed to get payment URL');
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      icon: CreditCard,
      name: "Debit Card",
      enabled: true
    },
    {
      icon: CreditCard, 
      name: "Credit Card",
      enabled: true
    },
    {
      icon: Building,
      name: "Bank Transfer", 
      enabled: true
    },
    {
      icon: DollarSign,
      name: "USSD",
      enabled: true
    }
  ];

  if (!selectedPlan) {
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
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Payment Processing</h1>
              <p className="text-muted-foreground">Secure payment via Paystack</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Details */}
            <Card className="animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Applicant</span>
                    <span className="font-medium">Favour Edward</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">favouredward2511@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment For</span>
                    <span className="font-medium">{selectedPlan.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-bold text-primary">₦{selectedPlan.amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Secure Payment</h2>
                </div>
                
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <p className="text-sm text-info-foreground">
                    Your payment is secured by Paystack with 256-bit SSL encryption. We don't store your card details on our servers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Payment Methods */}
          <Card className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Available Payment Methods</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={method.name}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      method.enabled 
                        ? 'border-border hover:border-primary/50 cursor-pointer' 
                        : 'border-muted bg-muted/30 opacity-50'
                    }`}
                  >
                    <method.icon className={`w-8 h-8 mx-auto mb-2 ${
                      method.enabled ? 'text-foreground' : 'text-muted-foreground'
                    }`} />
                    <p className={`text-sm font-medium ${
                      method.enabled ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {method.name}
                    </p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isProcessing ? "Processing..." : `Pay ₦${selectedPlan.amount.toLocaleString()}`}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                By clicking "Pay", you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentProcessing;
