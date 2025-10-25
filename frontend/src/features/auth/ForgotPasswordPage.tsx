import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // TODO: Implement actual forgot password API call
      // For now, simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // In a real implementation:
      // await api.auth.forgotPassword(data.email);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section: Branding */}
      <div className="relative flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center lg:text-left max-w-lg">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <Sparkles className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-extrabold tracking-tight">PromptForge</h1>
          </div>
          <p className="text-xl font-light leading-relaxed">
            Don't worry! Password recovery is just a few clicks away.
          </p>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
        <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-lg">
          {success ? (
            <>
              <CardHeader className="space-y-2 pb-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
                <CardDescription className="text-center text-base text-gray-700">
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>What's next?</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Check your inbox for an email from PromptForge</li>
                    <li>Click the reset link in the email</li>
                    <li>Create your new password</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Didn't receive an email? Check your spam folder or try again.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-center text-base text-gray-700">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        {...register('email')}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-11 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 text-center">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

