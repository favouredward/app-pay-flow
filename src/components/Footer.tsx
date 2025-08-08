
import React from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-2xl font-bold text-primary">BlacTech</h4>
            <p className="text-muted-foreground leading-relaxed">
              Empowering the next generation of tech professionals with world-class training and comprehensive learning experiences.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">Lagos, Nigeria</span>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:support@blactech.com" className="text-sm hover:underline">
                  support@blactech.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">+234 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">Mon - Fri: 9:00 AM - 5:00 PM (WAT)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Support</h4>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Need help with your application?</p>
                <p className="text-primary font-medium">We're here to assist you!</p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Response time: Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlacTech Training Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
