import { Button } from "@/components/ui/button";
import { Brain, Shield, Activity } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Medical AI Technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              AI-Powered<br />
              <span className="text-primary-glow">Stroke Prediction</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Advanced machine learning technology to assess your stroke risk based on comprehensive health data analysis
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-primary-glow mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Accurate Assessment</h3>
              <p className="text-white/80 text-sm">
                XGBoost ML model trained on comprehensive healthcare datasets
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Activity className="h-8 w-8 text-primary-glow mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-white/80 text-sm">
                Instant risk evaluation with detailed confidence metrics
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Brain className="h-8 w-8 text-primary-glow mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Evidence-Based</h3>
              <p className="text-white/80 text-sm">
                Built on validated medical research and clinical guidelines
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Brain className="h-5 w-5 mr-2" />
              Start Risk Assessment
            </Button>
            
            <div className="text-sm text-white/70 max-w-2xl mx-auto">
              <p>
                <strong>Medical Disclaimer:</strong> This tool is for educational purposes only. 
                Always consult with qualified healthcare professionals for medical advice and diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
    </div>
  );
};

export default Hero;