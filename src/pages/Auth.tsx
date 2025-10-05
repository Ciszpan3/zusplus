import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MFAVerification } from '@/components/MFAVerification';
import { MFAEnrollment } from '@/components/MFAEnrollment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthStep = 'login' | 'mfa-verify' | 'mfa-enroll';

const Auth = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  useEffect(() => {
    // If fully authenticated (AAL2), redirect to admin
    checkAuthStatus();
  }, [user]);

  const checkAuthStatus = async () => {
    if (!user) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    const aal = (session as any)?.aal;
    
    if (aal === 'aal2') {
      // Fully authenticated with MFA
      navigate('/admin');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        // Error already shown by toast in useAuth
        setIsLoading(false);
        return;
      }
      
      if (result.needsMFA) {
        // Check if user has MFA enrolled
        const { data: factors } = await supabase.auth.mfa.listFactors();
        
        if (factors?.totp && factors.totp.length > 0) {
          // Has MFA enrolled, need to verify
          setAuthStep('mfa-verify');
        } else {
          // No MFA enrolled, need to enroll
          setAuthStep('mfa-enroll');
        }
      } else {
        // No MFA required (shouldn't happen for admin)
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Błąd logowania');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerified = () => {
    console.log('MFA verified, redirecting to admin');
    navigate('/admin');
  };

  const handleMFAEnrolled = async () => {
    console.log('MFA enrolled, moving to verification');
    setAuthStep('mfa-verify');
  };

  if (authStep === 'mfa-verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <MFAVerification onVerified={handleMFAVerified} />
      </div>
    );
  }

  if (authStep === 'mfa-enroll') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <MFAEnrollment onComplete={handleMFAEnrolled} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Panel Administratora</CardTitle>
          <CardDescription>Zaloguj się używając email i hasła</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="administrator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
