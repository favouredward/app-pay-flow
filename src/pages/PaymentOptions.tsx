
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const PaymentOptions = () => {
  const [selectedPlan, setSelectedPlan] = useState("1-month");
  const navigate = useNavigate();

  const paymentPlans = [
    {
      id: "1-month",
      title: "1 Month Payment",
      amount: 10000,
      description: "Pay for one month",
      features: [
        "₦10,000 per month",
        "Secure payment processing", 
        "Instant confirmation"
      ],
      recommended: false,
      months: 1,
      colorScheme: "green"
    },
    {
      id: "2-months",
      title: "2 Months Payment", 
      amount: 20000,
      description: "Pay for two months",
      features: [
        "₦20,000 total",
        "Secure payment processing",
        "Instant confirmation", 
        "Pay in advance & secure your spot"
      ],
      recommended: true,
      months: 2,
      colorScheme: "purple"
    },
    {
      id: "4-months",
      title: "4 Months Payment",
      amount: 40000,
      description: "Pay remaining 4 months",
      features: [
        "₦10,000 per month",
        "Secure payment processing",
        "Instant confirmation",
        "Pay in advance & secure your spot"
      ],
      recommended: true,
      months: 4,
      colorScheme: "green"
    }
  ];

  const handleBack = () => {
    navigate("/application-details");
  };

  const handleProceedToPayment = () => {
    const plan = paymentPlans.find(p => p.id === selectedPlan);
    sessionStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/payment");
  };

  const getCardStyles = (plan: any, isSelected: boolean) => {
    const baseStyles = "relative cursor-pointer transition-all duration-200 hover:shadow-lg animate-slide-up";
    
    if (plan.colorScheme === "purple") {
      return `${baseStyles} ${
        isSelected 
          ? 'border-purple-500 shadow-lg ring-2 ring-purple-500/20 bg-purple-50/50' 
          : 'hover:border-purple-500/50'
      }`;
    }
    
    return `${baseStyles} ${
      isSelected 
        ? 'border-primary shadow-lg ring-2 ring-primary/20 bg-primary/5' 
        : 'hover:border-primary/50'
    }`;
  };

  const getRecommendedBadgeStyles = (plan: any) => {
    if (plan.colorScheme === "purple") {
      return "bg-purple-500 text-white";
    }
    return "bg-primary text-primary-foreground";
  };

  const getIconStyles = (plan: any) => {
    if (plan.colorScheme === "purple") {
      return "text-purple-500";
    }
    return "text-primary";
  };

  const getFeatureStyles = (feature: string, plan: any) => {
    if (feature.includes('Pay in advance')) {
      if (plan.colorScheme === "purple") {
        return 'text-purple-600 font-medium';
      }
      return 'text-primary font-medium';
    }
    return '';
  };

  const getSelectionButtonStyles = (plan: any, isSelected: boolean) => {
    if (plan.colorScheme === "purple") {
      return isSelected 
        ? 'bg-purple-500 text-white' 
        : 'bg-muted text-muted-foreground';
    }
    
    return isSelected 
      ? 'bg-primary text-primary-foreground' 
      : 'bg-muted text-muted-foreground';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 payment-container">
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
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
              <h1 className="text-3xl font-bold text-foreground">Payment Options</h1>
              <p className="text-muted-foreground">Choose how many months you'd like to pay for</p>
            </div>
          </div>

          {/* Payment Progress */}
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Payment Progress</h3>
                  <p className="text-sm text-muted-foreground">0 of 4 months completed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">₦40,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {paymentPlans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={getCardStyles(plan, selectedPlan === plan.id)}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className={`${getRecommendedBadgeStyles(plan)} text-xs font-medium px-3 py-1 rounded-full`}>
                      Recommended
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className={`w-5 h-5 ${getIconStyles(plan)}`} />
                    <h3 className="text-lg font-semibold">{plan.title}</h3>
                    {selectedPlan === plan.id && (
                      <Check className={`w-5 h-5 ${getIconStyles(plan)} ml-auto`} />
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-foreground">
                      ₦{plan.amount.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.colorScheme === 'purple' ? 'bg-purple-500' : 'bg-primary'}`} />
                        <span className={getFeatureStyles(feature, plan)}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className={`w-full px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors ${getSelectionButtonStyles(plan, selectedPlan === plan.id)}`}>
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Summary */}
          <Card className="animate-slide-up bg-gradient-to-r from-card to-purple-50/30" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" />
                <h3 className="text-lg font-semibold">Payment Summary</h3>
              </div>
              
              {selectedPlan && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Selected Plan:</span>
                    <span className="font-medium">{paymentPlans.find(p => p.id === selectedPlan)?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₦{paymentPlans.find(p => p.id === selectedPlan)?.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment Method:</span>
                    <span>Paystack (Card, Bank Transfer, USSD)</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">₦{paymentPlans.find(p => p.id === selectedPlan)?.amount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proceed Button */}
          <Button 
            onClick={handleProceedToPayment}
            className="btn-primary w-full animate-slide-up bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            style={{animationDelay: '0.5s'}}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentOptions;
