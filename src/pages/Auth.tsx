import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Shield, QrCode } from 'lucide-react';

type AuthStep = 'login' | 'mfa-setup' | 'mfa-verify';

const Auth = () => {
  const navigate = useNavigate();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth flow state
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  
  // MFA setup state
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  
  // MFA verification state
  const [mfaCode, setMfaCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error(signInError.message);
        setIsLoading(false);
        return;
      }

      // Check if user has MFA enrolled
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        toast.error('Błąd sprawdzania MFA');
        setIsLoading(false);
        return;
      }

      const hasMFA = factors?.totp && factors.totp.length > 0;

      if (!hasMFA) {
        // No MFA - need to set it up
        await startMFAEnrollment();
      } else {
        // Has MFA - need to verify
        setAuthStep('mfa-verify');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Błąd logowania');
      setIsLoading(false);
    }
  };

  const startMFAEnrollment = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin Authenticator'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setAuthStep('mfa-setup');
      setIsLoading(false);
    } catch (error: any) {
      toast.error('Błąd konfiguracji 2FA');
      setIsLoading(false);
    }
  };

  const verifyMFASetup = async () => {
    if (mfaCode.length !== 6) return;

    setIsLoading(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: mfaCode
      });

      if (error) throw error;

      toast.success('2FA skonfigurowane pomyślnie!');
      
      // Direct navigation - user is now authenticated
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (error: any) {
      toast.error('Nieprawidłowy kod');
      setMfaCode('');
      setIsLoading(false);
    }
  };

  const verifyMFALogin = async () => {
    if (mfaCode.length !== 6) return;

    setIsLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];
      
      if (!totpFactor) {
        toast.error('Nie znaleziono 2FA');
        setIsLoading(false);
        return;
      }

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;

      const { error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: mfaCode
      });

      if (error) throw error;

      toast.success('Zalogowano pomyślnie!');
      
      // Direct navigation - user is now authenticated
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (error: any) {
      toast.error('Nieprawidłowy kod');
      setMfaCode('');
      setIsLoading(false);
    }
  };

  // MFA Setup View
  if (authStep === 'mfa-setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Konfiguracja 2FA
            </CardTitle>
            <CardDescription>
              Zeskanuj kod QR w aplikacji Google Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {qrCode && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Lub wpisz ręcznie:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                    {secret}
                  </code>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Label>Wpisz kod weryfikacyjny</Label>
              <InputOTP
                maxLength={6}
                value={mfaCode}
                onChange={setMfaCode}
                onComplete={verifyMFASetup}
              >
                <InputOTPGroup className="w-full justify-center">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button 
                onClick={verifyMFASetup} 
                disabled={isLoading || mfaCode.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Weryfikacja...' : 'Potwierdź i aktywuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // MFA Verification View
  if (authStep === 'mfa-verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Weryfikacja 2FA
            </CardTitle>
            <CardDescription>
              Wpisz 6-cyfrowy kod z aplikacji Google Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputOTP
              maxLength={6}
              value={mfaCode}
              onChange={setMfaCode}
              onComplete={verifyMFALogin}
            >
              <InputOTPGroup className="w-full justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button 
              onClick={verifyMFALogin} 
              disabled={isLoading || mfaCode.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Weryfikacja...' : 'Zweryfikuj'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>zusplus</CardTitle>
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
