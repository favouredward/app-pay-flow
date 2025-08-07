
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentProcessing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

    try {
      // TODO: Integrate with Paystack
      // For now, simulate payment processing
      console.log("Processing payment for:", selectedPlan);
      
      // Simulate payment success
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
      
    } catch (error) {
      console.error("Payment error:", error);
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
      enabled: false
    },
    {
      icon: DollarSign,
      name: "USSD",
      enabled: false
    }
  ];

  if (!selectedPlan) {
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ₦{selectedPlan.amount.toLocaleString()}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By clicking "Pay", you agree to our terms and conditions
            </p>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Payment Portal</h4>
            <p>Secure payment processing for your program applications. Powered by Paystack for safe and reliable transactions.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Payment Options</h4>
            <ul className="space-y-1">
              <li>• Monthly payments (₦10,000)</li>
              <li>• Flexible payment plans</li>
              <li>• Multiple payment methods</li>
              <li>• Instant payment confirmation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Support</h4>
            <p>Email: support@yourcompany.com</p>
            <p>Phone: +234 123 456 7890</p>
            <p>Hours: Mon-Fri 9AM-5PM</p>
          </div>
        </div>

        <div className="text-center pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for our amazing applicants
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 BlacTech Training Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
