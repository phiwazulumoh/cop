import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { UserPlus, LogIn, Users } from "lucide-react";
import { signUp, signIn, type UserData } from "../services/apiService";

interface AuthFormsProps {
  isSignUp: boolean;
  onSubmit: (userData?: any) => void;
}

export function AuthForms({ isSignUp: initialIsSignUp, onSubmit }: AuthFormsProps) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",        
    designation: "",
    profilePicture: "",    
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (isSignUp && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      let response;
      
      if (isSignUp) {
        const userData: UserData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || undefined,
          designation: formData.designation,
          profilePicture: formData.profilePicture || undefined
        };
        console.log('Submitting signup with:', userData);
        response = await signUp(userData);
        console.log('Signup response:', response);
      } else {
        console.log('Submitting signin with:', { email: formData.email });
        response = await signIn(formData.email, formData.password);
        console.log('Signin response:', response);
      }

      // Backend returns { message, user, token }
      if (response?.user) {
        console.log('Authentication successful, calling onSubmit with:', response.user);
        onSubmit(response.user);
      } else {
        console.log('Authentication failed, response:', response);
        throw new Error(response?.error || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      const errorMessage = error.message || "Authentication failed. Please try again.";
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      middleName: "",
      designation: "",
      profilePicture: "",
    });
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto max-h-screen p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-semibold">Community of Practice</h1>
        </div>
        <p className="text-muted-foreground">
          Connecting midwives to share knowledge and expertise
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            {isSignUp ? (
              <>
                <UserPlus className="h-5 w-5" />
                Create your account
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign in to your account
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Join our community of midwifery professionals"
              : "Welcome back to the community"
            }
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/*
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle name (optional)</Label>
                  <Input
                    id="middleName"
                    placeholder="Optional"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                  />
                </div>
                */}

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="e.g., Doctor, Nurse, Midwife"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    required
                  />
                </div>

                {/*
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL (optional)</Label>
                  <Input
                    id="profilePicture"
                    placeholder="https://example.com/image.jpg"
                    value={formData.profilePicture}
                    onChange={(e) => handleInputChange("profilePicture", e.target.value)}
                  />
                </div>
                */}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane.smith@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </div>
              ) : (
                isSignUp ? "Create account" : "Sign in"
              )}
            </Button>

            <div className="relative w-full">
              <Separator />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={toggleForm}
            >
              {isSignUp 
                ? "Already have an account? Sign in"
                : "New to the community? Create account"
              }
            </Button>

            {!isSignUp && (
              <Button variant="ghost" className="w-full text-sm">
                Forgot your password?
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        <p className="mt-1">
          This platform is for verified midwifery professionals only.
        </p>
      </div>
    </div>
  );
}