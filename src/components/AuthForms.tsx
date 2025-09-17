import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { UserPlus, LogIn, Users } from "lucide-react";

interface AuthFormsProps {
  isSignUp: boolean;
  onSubmit: () => void;
}

export function AuthForms({ isSignUp: initialIsSignUp, onSubmit }: AuthFormsProps) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    nursingNumber: "",
    workplace: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation logic here if needed (e.g., check passwords match for sign-up)
    console.log("Form submitted:", formData);
    onSubmit(); // Trigger navigation to main app
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      nursingNumber: "",
      workplace: ""
    });
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

                <div className="space-y-2">
                  <Label htmlFor="nursingNumber">Nursing registration number</Label>
                  <Input
                    id="nursingNumber"
                    placeholder="e.g., 12A3456E"
                    value={formData.nursingNumber}
                    onChange={(e) => handleInputChange("nursingNumber", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Your professional registration number for verification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workplace">Workplace/Institution</Label>
                  <Input
                    id="workplace"
                    placeholder="e.g., City General Hospital"
                    value={formData.workplace}
                    onChange={(e) => handleInputChange("workplace", e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="nursingNumber">Nursing registration number</Label>
                <Input
                  id="nursingNumber"
                  placeholder="e.g., 12A3456E"
                  value={formData.nursingNumber}
                  onChange={(e) => handleInputChange("nursingNumber", e.target.value)}
                  required
                />
              </div>
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
          </CardContent>
                <br />
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {isSignUp ? "Create account" : "Sign in"}
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