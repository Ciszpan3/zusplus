import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MFAEnrollment } from '@/components/MFAEnrollment';
import { supabase } from '@/integrations/supabase/client';
import { DashboardAIChat } from '@/components/DashboardAIChat';
import { downloadReport } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

const Admin = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [needsMFASetup, setNeedsMFASetup] = useState(false);
  const [checkingMFA, setCheckingMFA] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user && !needsMFASetup && checkingMFA) {
      checkMFAStatus();
    }
  }, [user, loading]);

  const checkMFAStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
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
      navigate('/auth');
    } finally {
      setCheckingMFA(false);
    }
  };

  const handleMFAComplete = () => {
    setNeedsMFASetup(false);
    window.location.reload();
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raport_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Raport pobrany",
        description: "Plik Excel został pomyślnie pobrany.",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać raportu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
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
            <CardTitle>Panel Administratora</CardTitle>
            <CardDescription>Zalogowany jako: {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Raporty</h3>
              <Button 
                onClick={handleDownloadReport} 
                disabled={downloading}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading ? 'Pobieranie...' : 'Pobierz raport Excel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <DashboardAIChat userEmail={user.email || ''} />
    </div>
  );
};

export default Admin;
