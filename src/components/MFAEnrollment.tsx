import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

interface MFAEnrollmentProps {
  onComplete: () => void;
}

export const MFAEnrollment = ({ onComplete }: MFAEnrollmentProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const startEnrollment = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin Authenticator'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start enrollment');
      setEnrolling(false);
    }
  };

  const verifyEnrollment = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Create a challenge first to get the challengeId
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      // Verify using the challenge ID
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode
      });

      if (error) throw error;

      toast.success('MFA enabled successfully!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Invalid code. Please try again.');
      setVerifyCode('');
    } finally {
      setLoading(false);
    }
  };

  if (!enrolling) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Secure your admin account with Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startEnrollment} className="w-full">
            Set Up Authenticator
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>
          Use Google Authenticator or any TOTP app to scan this code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qrCode && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Or enter manually:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {secret}
              </code>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter verification code</label>
            <InputOTP
              maxLength={6}
              value={verifyCode}
              onChange={setVerifyCode}
              onComplete={verifyEnrollment}
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
          </div>

          <Button 
            onClick={verifyEnrollment} 
            disabled={loading || verifyCode.length !== 6}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
