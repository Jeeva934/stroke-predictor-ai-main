import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionData {
  gender: string;
  age: string;
  hypertension: string;
  heart_disease: string;
  ever_married: string;
  work_type: string;
  residence_type: string;
  avg_glucose_level: string;
  bmi: string;
  smoking_status: string;
}

interface PredictionResult {
  prediction: number;
  risk_level: string;
  confidence: number;
}

const StrokePredictor = () => {
  const [formData, setFormData] = useState<PredictionData>({
    gender: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    ever_married: "",
    work_type: "",
    residence_type: "",
    avg_glucose_level: "",
    bmi: "",
    smoking_status: "",
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof PredictionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = Object.keys(formData) as (keyof PredictionData)[];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const age = parseFloat(formData.age);
    const bmi = parseFloat(formData.bmi);
    const glucose = parseFloat(formData.avg_glucose_level);

    if (age < 0 || age > 120) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 0 and 120.",
        variant: "destructive",
      });
      return false;
    }

    if (bmi < 10 || bmi > 50) {
      toast({
        title: "Invalid BMI",
        description: "Please enter a valid BMI between 10 and 50.",
        variant: "destructive",
      });
      return false;
    }

    if (glucose < 50 || glucose > 500) {
      toast({
        title: "Invalid Glucose Level",
        description: "Please enter a valid glucose level between 50 and 500 mg/dL.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const predictStrokeRisk = async (data: PredictionData): Promise<PredictionResult> => {
    // Transform form data to match ML model input format
    const apiData = {
      gender: parseInt(data.gender),
      age: parseFloat(data.age),
      hypertension: parseInt(data.hypertension),
      heart_disease: parseInt(data.heart_disease),
      ever_married: parseInt(data.ever_married),
      work_type: parseInt(data.work_type),
      Residence_type: parseInt(data.residence_type),
      avg_glucose_level: parseFloat(data.avg_glucose_level),
      bmi: parseFloat(data.bmi),
      smoking_status: parseInt(data.smoking_status)
    };

    // Replace with your actual API endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Transform API response to match our interface
    return {
      prediction: result.prediction,
      risk_level: result.risk_level || (result.prediction === 1 ? "High" : "Low"),
      confidence: result.confidence || (result.prediction === 1 ? 85 : 75)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setPrediction(null);

    try {
      
      const result = await predictStrokeRisk(formData);
      setPrediction(result);

      toast({
        title: "Prediction Complete",
        description: "Your stroke risk assessment has been generated.",
      });
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request.";
      toast({
        title: "Prediction Failed",
        description: errorMessage.includes('fetch') ? "Cannot connect to prediction service. Please check your backend is running." : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return "destructive";
      case "Moderate": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return <AlertTriangle className="h-5 w-5" />;
      case "Moderate": return <Activity className="h-5 w-5" />;
      case "Low": return <CheckCircle className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Stroke Risk Assessment
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Enter your health information to get an AI-powered stroke risk prediction
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="0">Female</SelectItem>
                      <SelectItem value="2">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    min="0"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ever_married">Marital Status</Label>
                  <Select value={formData.ever_married} onValueChange={(value) => handleInputChange("ever_married", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes (Married)</SelectItem>
                      <SelectItem value="0">No (Never married)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_type">Work Type</Label>
                  <Select value={formData.work_type} onValueChange={(value) => handleInputChange("work_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Private</SelectItem>
                      <SelectItem value="3">Self-employed</SelectItem>
                      <SelectItem value="0">Government job</SelectItem>
                      <SelectItem value="1">Never worked</SelectItem>
                      <SelectItem value="4">Children</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residence_type">Residence Type</Label>
                  <Select value={formData.residence_type} onValueChange={(value) => handleInputChange("residence_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select residence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Urban</SelectItem>
                      <SelectItem value="0">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Health Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="hypertension">Hypertension</Label>
                  <Select value={formData.hypertension} onValueChange={(value) => handleInputChange("hypertension", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have hypertension?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heart_disease">Heart Disease</Label>
                  <Select value={formData.heart_disease} onValueChange={(value) => handleInputChange("heart_disease", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have heart disease?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avg_glucose_level">Average Glucose Level (mg/dL)</Label>
                  <Input
                    id="avg_glucose_level"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.avg_glucose_level}
                    onChange={(e) => handleInputChange("avg_glucose_level", e.target.value)}
                    min="50"
                    max="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI (Body Mass Index)</Label>
                  <Input
                    id="bmi"
                    type="number"
                    placeholder="e.g., 24.5"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange("bmi", e.target.value)}
                    step="0.1"
                    min="10"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smoking_status">Smoking Status</Label>
                  <Select value={formData.smoking_status} onValueChange={(value) => handleInputChange("smoking_status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Never smoked</SelectItem>
                      <SelectItem value="1">Formerly smoked</SelectItem>
                      <SelectItem value="2">Smokes</SelectItem>
                      <SelectItem value="3">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                variant="medical"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Predict Stroke Risk
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {prediction && (
        <Card className="shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Badge 
                  variant={getRiskColor(prediction.risk_level) as any}
                  className="text-lg px-6 py-3 flex items-center gap-2"
                >
                  {getRiskIcon(prediction.risk_level)}
                  {prediction.risk_level} Risk
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {prediction.prediction === 1 ? "Higher" : "Lower"} stroke risk detected
                </p>
                <p className="text-muted-foreground">
                  Confidence: {prediction.confidence.toFixed(1)}%
                </p>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This prediction is for educational purposes only and should not replace professional medical advice. 
                Please consult with a healthcare provider for proper medical evaluation and personalized recommendations.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold">Prevention</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Regular exercise and healthy diet
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold">Monitor</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Regular blood pressure and glucose checks
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold">Consult</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Speak with your healthcare provider
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrokePredictor;