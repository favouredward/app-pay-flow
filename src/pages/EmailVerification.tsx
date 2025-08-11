
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsVerifying(true);
    setShowApplyButton(false);
    
    try {
      console.log('Verifying email:', email);
      
      // Fetch application by email
      const { data: applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .limit(1);

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to verify email");
        return;
      }

      console.log('Found applications:', applications);

      if (!applications || applications.length === 0) {
        toast.error("No application found with this email address");
        setShowApplyButton(true);
        return;
      }

      const applicationData = applications[0];
      console.log('Application data:', applicationData);
      
      // Store both email and application data in sessionStorage
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("applicationData", JSON.stringify(applicationData));
      
      toast.success("Email verified successfully!");
      navigate("/application-details");
      
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Email verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyNow = () => {
    window.open("https://apply.blactechafrica.com", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 payment-container">
        <div className="w-full max-w-md mx-auto p-4 space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Verification</h1>
            <p className="text-muted-foreground">
              Enter your email to verify your application and proceed with payment
            </p>
          </div>

          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    disabled={isVerifying}
                  />
                </div>
                
                <Button
                  onClick={handleVerifyEmail}
                  disabled={isVerifying || !email}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {showApplyButton && (
                  <div className="space-y-3 pt-4 border-t">
                    <Button
                      onClick={handleApplyNow}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      After submitting your application, please return here to complete your payment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  Do you have an application yet?
                </p>
                <p className="text-xs text-foreground">
                  If you haven't submitted an application yet, please contact support to get started with your BlacTech training program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmailVerification;
