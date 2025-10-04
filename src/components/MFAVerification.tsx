import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface MFAVerificationProps {
  onVerified: () => void;
}

export const MFAVerification = ({ onVerified }: MFAVerificationProps) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const verifyMFA = async () => {
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;

      const totpFactor = factors.data.totp[0];
      if (!totpFactor) {
        toast.error('No MFA factor found');
        return;
      }

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: code
      });

      if (verify.error) throw verify.error;

      toast.success('Verified successfully!');
      onVerified();
    } catch (error: any) {
      toast.error(error.message || 'Invalid code. Please try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          onComplete={verifyMFA}
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
          onClick={verifyMFA} 
          disabled={loading || code.length !== 6}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </CardContent>
    </Card>
  );
};
