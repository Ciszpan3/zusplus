import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MFAEnrollment } from '@/components/MFAEnrollment';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, session, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [needsMFASetup, setNeedsMFASetup] = useState(false);
  const [checkingMFA, setCheckingMFA] = useState(true);
  const [mfaChecked, setMfaChecked] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user && !mfaChecked && !checkingMFA) {
      checkMFAStatus();
    }
  }, [user, loading, mfaChecked, checkingMFA]);

  const checkMFAStatus = async () => {
    if (mfaChecked || checkingMFA) return; // Prevent multiple checks
    
    setCheckingMFA(true);
    try {
      const aal = (session as any)?.aal;

      if (aal !== 'aal2') {
        // Check if user has enrolled MFA
        const { data: factors } = await supabase.auth.mfa.listFactors();
        if (!factors?.totp || factors.totp.length === 0) {
          setNeedsMFASetup(true);
        } else {
          // Has MFA but not verified - redirect to login
          navigate('/auth');
        }
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
    } finally {
      setCheckingMFA(false);
      setMfaChecked(true);
    }
  };

  const handleMFAComplete = () => {
    setNeedsMFASetup(false);
    window.location.reload();
  };

  if (loading || checkingMFA) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsMFASetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <MFAEnrollment onComplete={handleMFAComplete} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Admin Panel</CardTitle>
            <CardDescription>You are logged in as: {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your protected admin dashboard. More features coming soon!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
