
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement Supabase email verification
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store email in sessionStorage for next page
      sessionStorage.setItem("userEmail", email);
      
      // Navigate to application details
      navigate("/application-details");
      
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error("Email not found. Please check your email address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card animate-fade-in">
        <div className="payment-header">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="payment-title">Payment Portal</h1>
          <p className="payment-subtitle">
            Enter your email to access payment options
          </p>
        </div>

        <form onSubmit={handleVerifyEmail} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="form-input"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="info-box mt-6">
          <p className="font-medium mb-1">Don't have an application yet?</p>
          <p className="text-sm opacity-90 mb-3">
            If you haven't submitted your application, please complete it first before making any payments.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open('#', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Application Portal
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:support@yourdomain.com" className="text-primary hover:underline">
              support@yourdomain.com
            </a>
          </p>
        </div>

        <div className="security-note">
          <Shield className="w-4 h-4" />
          Your payment information is secured with 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
