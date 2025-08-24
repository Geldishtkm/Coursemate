import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, ArrowLeft, Info, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from "@/lib/api";

const Signup = () => {
  // Regex for checking special characters that can cause backend issues
  const specialCharRegex = /[^\w\s@$!%*#?&]/;
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    department: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as "STUDENT",
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Check for special characters that can cause backend issues
    const specialCharRegex = /[^\w\s@$!%*#?&]/;
    if (specialCharRegex.test(formData.password)) {
      setError("Password contains special characters that are not allowed. Please use only letters, numbers, and basic symbols (@$!%*#?&)");
      return;
    }

    // Check Student ID for special characters
    if (specialCharRegex.test(formData.studentId)) {
      setError("Student ID contains special characters that are not allowed. Please use only letters and numbers.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        studentId: formData.studentId,
        department: formData.department,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "Account created successfully. You can now log in.",
        });
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only allow 'student' role selection for public signup
  // Role selection removed, all new users are students

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Back to home button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 text-white hover:text-primary-glow transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        <Card className="shadow-elegant border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Join CourseMate</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Password Requirements:</span> At least 6 characters, avoid special characters like ö, ü, ä, ç, ñ, etc. Use only letters, numbers, and basic symbols (@$!%*#?&).
              </AlertDescription>
            </Alert>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                                     <Input
                     id="firstName"
                     placeholder="Enter your first name"
                     value={formData.firstName}
                     onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                     required
                   />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                                     <Input
                     id="lastName"
                     placeholder="Enter your last name"
                     value={formData.lastName}
                     onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@student.unideb.hu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                   <Label htmlFor="studentId">Student ID</Label>
                   <Input
                     id="studentId"
                     placeholder="e.g., ABC12345"
                     value={formData.studentId}
                     onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                     required
                   />
                   <p className="text-xs text-muted-foreground">
                     Use only letters and numbers (A-Z, 0-9)
                   </p>
                 </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>


              
                             <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input
                   id="password"
                   type="password"
                   placeholder="Create a strong password (min 6 chars, no special chars)"
                   value={formData.password}
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                   required
                 />
                 <p className="text-xs text-muted-foreground">
                   Password must be at least 6 characters long. 
                   <span className="text-orange-600 font-medium"> Avoid special characters like ö, ü, ä, ç, ñ, etc.</span>
                 </p>
                 {formData.password && (
                   <div className="text-xs">
                     <span className={`font-medium ${formData.password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                       ✓ Length: {formData.password.length >= 6 ? 'Good' : 'Too short'}
                     </span>
                     <span className={`ml-2 font-medium ${!specialCharRegex.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                       ✓ Characters: {!specialCharRegex.test(formData.password) ? 'Valid' : 'Contains special chars'}
                     </span>
                   </div>
                 )}
               </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                />
                <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-glow transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-glow transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full shadow-button"
                disabled={!formData.agreeToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* University info */}
        <div className="mt-6 text-center text-white/80 text-sm">
          <p>University of Debrecen • CourseMate Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;