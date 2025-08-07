
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Building, CreditCard, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ApplicationDetails = () => {
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      navigate("/");
      return;
    }

    // TODO: Fetch application data from Supabase
    // For now, simulate with mock data
    setTimeout(() => {
      setApplicationData({
        fullName: "Favour Edward",
        email: "favouredward2511@gmail.com",
        phone: "08039771139",
        dateOfBirth: "7/1/2025",
        location: "Oyo, Nigeria",
        program: "Data Analysis",
        employmentStatus: "Unemployed",
        paymentStatus: "Unpaid",
        monthsPaid: 0,
        totalRequired: 4,
        totalPaid: 0,
        remaining: 40000,
        reasonForJoining: "To advance my career in data analysis and gain practical skills in the field."
      });
      setIsLoading(false);
    }, 1000);
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
      <div className="payment-container">
        <div className="payment-card">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="text-center py-8">
            <p className="text-destructive">Application not found</p>
            <Button onClick={handleBack} className="mt-4">
              Go Back
            </Button>
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
                  <p className="font-medium">{applicationData.fullName}</p>
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
                    <p className="font-medium">{applicationData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{applicationData.dateOfBirth}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{applicationData.location}</p>
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
                    <p className="font-medium">{applicationData.employmentStatus}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                    {applicationData.paymentStatus}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Months Paid: {applicationData.monthsPaid} / {applicationData.totalRequired}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(applicationData.monthsPaid / applicationData.totalRequired) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Total Paid:</span>
                    <span className="font-medium">₦{applicationData.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Remaining:</span>
                    <span className="font-bold text-primary">₦{applicationData.remaining.toLocaleString()}</span>
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
              {applicationData.reasonForJoining}
            </p>
          </CardContent>
        </Card>

        {/* Email Verification Success Alert */}
        <div className="success-box animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verified!</p>
              <p className="text-sm opacity-90">Your application has been found. Proceed with your payment options.</p>
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
  );
};

export default ApplicationDetails;
