import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DashboardAIChat } from '@/components/DashboardAIChat';
import { downloadReport } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

const Admin = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, [user, loading]);

  const checkMFAStatus = async () => {
    if (loading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check AAL level - must be aal2 (MFA verified)
      const assuranceLevel = (session as any).aal;
      
      if (assuranceLevel !== 'aal2') {
        // Not fully authenticated with MFA
        navigate('/auth');
        return;
      }

      setIsChecking(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    }
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

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel Administratora</h1>
          <Button onClick={signOut} variant="outline">
            Wyloguj się
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Witaj w Panelu Administratora</CardTitle>
            <CardDescription>Zalogowany jako: {user?.email}</CardDescription>
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
      
      <DashboardAIChat userEmail={user?.email || ''} />
    </div>
  );
};

export default Admin;
