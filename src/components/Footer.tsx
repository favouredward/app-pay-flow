
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">BlacTech Training Portal</h4>
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of tech professionals with world-class training programs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Frontend Development</li>
              <li>Backend Development</li>
              <li>Mobile Development</li>
              <li>Data Science</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@blactech.com</p>
              <p>Phone: +234 123 456 7890</p>
              <p>Hours: Mon-Fri 9AM-5PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlacTech Training Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
