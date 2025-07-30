import { Brain, Heart, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <span className="text-lg font-bold">StrokePredictor AI</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Advanced AI technology for stroke risk assessment and prevention.
            </p>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h4 className="font-semibold">Medical Information</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Risk Factors</li>
              <li>Prevention Tips</li>
              <li>Health Guidelines</li>
              <li>Research Data</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>How It Works</li>
              <li>Medical Disclaimer</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Technical Support</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 StrokePredictor AI. For educational purposes only.
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Healthcare Technology</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;