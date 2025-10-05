import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardAIChat } from '@/components/DashboardAIChat';
import { downloadReport, fetchStatistics, clearStatistics, StatisticsResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, Trash2, Users, Wallet, TrendingDown, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Admin = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [clearingStats, setClearingStats] = useState(false);

  useEffect(() => {
    // Simple guard - only check if user exists
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    setLoadingStats(true);
    try {
      const data = await fetchStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać statystyk.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleClearStatistics = async () => {
    setClearingStats(true);
    try {
      const response = await clearStatistics();
      toast({
        title: "Sukces",
        description: response.wiadomosc || "Statystyki zostały wyczyszczone.",
      });
      await loadStatistics();
    } catch (error) {
      console.error('Error clearing statistics:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wyczyścić statystyk.",
        variant: "destructive",
      });
    } finally {
      setClearingStats(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ładowanie...</p>
        </div>
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
          <h1 className="text-2xl font-bold">Panel Administratora</h1>
          <Button onClick={signOut} variant="outline">
            Wyloguj się
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-6">
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statystyki</CardTitle>
                <CardDescription>
                  {statistics?.liczba_zapytan !== undefined 
                    ? `Liczba zapytań: ${statistics.liczba_zapytan}`
                    : 'Brak danych'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={loadStatistics}
                  disabled={loadingStats}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                  Odśwież
                </Button>
                <Button
                  onClick={handleClearStatistics}
                  disabled={clearingStats || !statistics?.liczba_zapytan}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Wyczyść
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : statistics?.statystyki ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Średni wiek
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.statystyki.sredni_wiek.toFixed(1)} lat
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Średnie wynagrodzenie
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.statystyki.srednie_wynagrodzenie.toFixed(2)} zł
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4" />
                        Średnia emerytura
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.statystyki.srednia_prognozowana_emerytura.toFixed(2)} zł
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Suma zapytań
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.statystyki.rozklad_plci.kobiety + statistics.statystyki.rozklad_plci.mezczyzni}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rozkład płci</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Kobiety', value: statistics.statystyki.rozklad_plci.kobiety },
                            { name: 'Mężczyźni', value: statistics.statystyki.rozklad_plci.mezczyzni }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="hsl(var(--chart-1))" />
                          <Cell fill="hsl(var(--chart-2))" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Brak statystyk do wyświetlenia
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <DashboardAIChat userEmail={user?.email || ''} />
    </div>
  );
};

export default Admin;
