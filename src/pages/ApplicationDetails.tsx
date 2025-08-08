import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Building, CreditCard, ArrowRight, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const ApplicationDetails = () => {
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const email = sessionStorage.getItem("userEmail");
      const storedApplicationData = sessionStorage.getItem("applicationData");
      
      if (!email) {
        navigate("/");
        return;
      }

      if (storedApplicationData) {
        const parsedData = JSON.parse(storedApplicationData);
        setApplicationData(parsedData);
        
        // Fetch payment data for this application
        try {
          const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('application_id', parsedData.id)
            .eq('payment_status', 'success')
            .order('created_at', { ascending: false });

          if (!error && payments) {
            const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
            const monthsPaid = payments.reduce((sum, p) => sum + p.months_paid_for, 0);
            
            setPaymentData({
              totalPaid,
              monthsPaid,
              remaining: 40000 - totalPaid,
              payments
            });
          }
        } catch (error) {
          console.error('Error fetching payment data:', error);
        }
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleProceedToPayment = () => {
    navigate("/payment-options");
  };

  const handleViewPaymentHistory = () => {
    navigate("/payment-history");
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

  if (!applicationData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 payment-container">
          <div className="payment-card">
            <div className="text-center py-8">
              <p className="text-destructive">Application not found</p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPaymentData = paymentData || {
    totalPaid: 0,
    monthsPaid: 0,
    remaining: 40000,
    payments: []
  };

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
              <h1 className="text-3xl font-bold text-foreground">Application Details</h1>
              <p className="text-muted-foreground">Review your application and proceed to payment</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <Card className="animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{applicationData.full_name}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{applicationData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{applicationData.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(applicationData.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{applicationData.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program & Payment Status Card */}
            <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Program & Payment Status</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Program</p>
                    <p className="font-medium">{applicationData.program}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Status</p>
                      <p className="font-medium">{applicationData.employment_status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      displayPaymentData.monthsPaid >= 4 
                        ? 'bg-success/10 text-success'
                        : displayPaymentData.monthsPaid > 0 
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                    }`}>
                      {displayPaymentData.monthsPaid >= 4 
                        ? 'Fully Paid' 
                        : displayPaymentData.monthsPaid > 0 
                          ? 'Partially Paid' 
                          : 'Unpaid'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Months Paid: {displayPaymentData.monthsPaid} / 4</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(displayPaymentData.monthsPaid / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Total Paid:</span>
                      <span className="font-medium">₦{displayPaymentData.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Remaining:</span>
                      <span className="font-bold text-primary">₦{displayPaymentData.remaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reason for Joining Card */}
          <Card className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Reason for Joining</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {applicationData.reason_for_joining || "No reason provided"}
              </p>
            </CardContent>
          </Card>

          {/* Email Verification Success Alert */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Email Verified!</p>
                  <p className="text-sm text-foreground">Your application has been found. Proceed with your payment options.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button
              onClick={handleProceedToPayment}
              className="btn-primary flex-1"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleViewPaymentHistory}
              variant="outline"
              className="flex-1"
            >
              View Payment History
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicationDetails;
