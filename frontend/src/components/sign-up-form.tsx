import { api } from "@/lib/api";
import {
   AtSign,
   Check,
   CircleUser,
   Loader2,
   Lock,
   Mail,
   Phone,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
   getPasswordStrength,
   validateEmail,
   validatePassword,
   validatePhone,
} from "../../utils/form-utils";
import { Button } from "./ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

type Step = "auth" | "phone" | "profile" | "success";
interface FormData {
   name: string;
   email: string;
   password: string;
   phone: string;
   otp: string;
   username: string;
}

export function SignUpForm() {
   const [step, setStep] = useState<Step>("auth");
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState<FormData>({
      name: "",
      email: "",
      password: "",
      phone: "",
      otp: "",
      username: "",
   });
   const [otpTimer, setOtpTimer] = useState(30);
   const [canResend, setCanResend] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (step === "auth") {
         setStep("phone");
         startOtpTimer();
      } else if (step === "phone") {
         setStep("profile");
      } else if (step === "profile") {
         setStep("success");
      }

      setLoading(false);
   };

   const handleRegister = async () => {
      setLoading(true);

      try {
         const res = await api.post("/api/auth/sign-up", {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
         });

         if (res.data.success) {
            toast.success(res.data.message);
            setStep("phone");
         }
      } catch (error) {
         toast.error("An error occurred. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const startOtpTimer = () => {
      setOtpTimer(30);
      setCanResend(false);
      const interval = setInterval(() => {
         setOtpTimer((prev) => {
            if (prev <= 1) {
               clearInterval(interval);
               setCanResend(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
   };

   const handleResendOtp = () => {
      if (canResend) {
         startOtpTimer();
         // Simulate OTP resend
         console.log("Resending OTP...");
      }
   };

   const handleVerify = async () => {
      setLoading(true);

      try {
         const res = await api.post("/api/auth/verify", {
            email: formData.email,
            verificationCode: formData.otp,
         });

         if (res.data.success) {
            toast.success(res.data.message);
            setStep("profile");
         }
      } catch (error) {
         toast.error("Invalid OTP. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   //  const handleGoogleLogin = async () => {
   //     setLoading(true);

   //     try {
   //        const res = await api.post("/api/auth/google-login");

   //        if (res.data.success) {
   //           toast.success(res.data.message);
   //           setStep("profile");
   //        }
   //     } catch (error) {
   //        toast.error("An error occurred. Please try again.");
   //     } finally {
   //        setLoading(false);
   //     }
   //  };

   const handleUsername = async () => {
      setLoading(true);

      try {
         const res = await api.post("/api/auth/username", {
            username: formData.username,
            email: formData.email,
         });

         if (res.data.success) {
            toast.success(res.data.message);
            setStep("success");
         }
      } catch (error) {
         toast.error("An error occurred. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const renderAuthStep = () => (
      <CardContent className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
               <CircleUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                     setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10"
               />
            </div>
         </div>
         <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                     setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
               />
            </div>
         </div>
         <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
               <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                     setFormData({ ...formData, phone: e.target.value })
                  }
                  className="pl-10"
               />
            </div>
         </div>
         <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
               <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                     setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10"
               />
            </div>
         </div>
         {formData.password && (
            <div className="space-y-2">
               <Progress
                  value={getPasswordStrength(formData.password).score * 25}
                  className="h-2"
               />
               <p className="text-sm text-muted-foreground">
                  Password strength:{" "}
                  {getPasswordStrength(formData.password).label}
               </p>
            </div>
         )}
         <Button
            type="submit"
            disabled={
               !validateEmail(formData.email) ||
               !validatePassword(formData.password) ||
               !validatePhone(formData.phone) ||
               loading
            }
            onClick={handleRegister}
            className="w-full"
         >
            {loading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               "Continue"
            )}
         </Button>
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>
         {/* <Button
            variant="outline"
            className="w-full"
            // onClick={handleGoogleLogin}
         >
            <img
               src="https://www.google.com/favicon.ico"
               alt="Google"
               className="mr-2 h-4 w-4"
            />
            Google
         </Button> */}
         <p className="text-sm text-center text-secondary-foreground">Already have an account ? <span className="text-primary" onClick={()=>{navigate('/auth/login')}}>Login </span></p>

      </CardContent>
   );

   const renderPhoneStep = () => (
      <CardContent className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex gap-2">
               {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                     key={index}
                     type="text"
                     maxLength={1}
                     value={formData.otp[index] || ""}
                     onChange={(e) => {
                        const newOtp = formData.otp.split("");
                        newOtp[index] = e.target.value;
                        setFormData({ ...formData, otp: newOtp.join("") });

                        // Auto-focus next input
                        if (e.target.value && e.target.nextElementSibling) {
                           (
                              e.target.nextElementSibling as HTMLInputElement
                           ).focus();
                        }
                     }}
                     className="w-10 text-center"
                  />
               ))}
            </div>
         </div>
         <div className="flex justify-between items-center">
            <Button
               type="button"
               variant="link"
               onClick={handleResendOtp}
               disabled={!canResend}
               className="p-0"
            >
               Resend Code
            </Button>
            {!canResend && (
               <span className="text-sm text-muted-foreground">
                  Resend in {otpTimer}s
               </span>
            )}
         </div>
         <Button
            type="submit"
            disabled={formData.otp.length !== 6 || loading}
            className="w-full"
            onClick={handleVerify}
         >
            {loading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               "Verify"
            )}
         </Button>
      </CardContent>
   );

   const renderProfileStep = () => (
      <CardContent className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
               <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) =>
                     setFormData({ ...formData, username: e.target.value })
                  }
                  className="pl-10"
               />
            </div>
         </div>

         <Button
            type="submit"
            disabled={!formData.username || loading}
            className="w-full"
            onClick={handleUsername}
         >
            {loading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               "Doneeee"
            )}
         </Button>
      </CardContent>
   );

   const renderSuccessStep = () => (
      <CardContent className="space-y-4 text-center">
         <Confetti />
         <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
         </div>
         <h2 className="text-2xl font-bold">
            Your time capsule journey begins now
         </h2>
         <p className="text-muted-foreground">
            Everything is set up and ready to go!
         </p>
         <Button
            onClick={() => {
               navigate("/friends");
            }}
            className="w-full"
         >
            Start Creating
         </Button>
      </CardContent>
   );

   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle className="text-2xl font-bold text-center">
                  {step === "auth" && "Create your account"}
                  {step === "phone" && "Verify your account"}
                  {step === "profile" && "Aap ko bulaye kaise?"}
                  {step === "success" && "Welcome aboard!"}
               </CardTitle>
               <CardDescription className="text-center">
                  {step === "auth" && "Start preserving your memories today"}
                  {step === "phone" &&
                     "Enter the code sent to your phone or email"}
                  {step === "profile" && "Tell us a bit about yourself"}
               </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               {step === "auth" && renderAuthStep()}
               {step === "phone" && renderPhoneStep()}
               {step === "profile" && renderProfileStep()}
               {step === "success" && renderSuccessStep()}
            </form>
         </Card>
      </div>
   );
}
