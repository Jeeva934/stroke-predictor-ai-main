import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import StrokePredictor from "@/components/StrokePredictor";
import Footer from "@/components/Footer";

const Index = () => {
  const [showPredictor, setShowPredictor] = useState(false);
  const predictorRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setShowPredictor(true);
    // Scroll to predictor after a brief delay to allow rendering
    setTimeout(() => {
      predictorRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onGetStarted={handleGetStarted} />
      
      {showPredictor && (
        <div ref={predictorRef} className="py-20 px-4 bg-gradient-to-br from-background via-secondary/20 to-background">
          <StrokePredictor />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
