import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIRecommendationsProps {
  retirementData: {
    age: number;
    gender: string;
    retirementAge: number;
    monthlyIncome: number;
    careerBreaks: number;
    sickLeaveDays: number;
    valorization: number;
    inflation: number;
    actualSalary: number;
    yearsToRetirement: number;
    futurePensionReal: number;
    futurePensionNominal: number;
    avgNationalPension: number;
    percentDifference: number;
    apiPensionNominal: number | null;
    apiPensionReal: number | null;
    weatherStatus: string;
    weatherDescription: string;
  };
}

export const AIRecommendations = ({ retirementData }: AIRecommendationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setIsLoading(true);
    setRecommendations('');

    try {
      const dashboardContext = {
        wiek: retirementData.age,
        plec: retirementData.gender === 'female' ? 'kobieta' : 'mężczyzna',
        wiek_przejscia_na_emeryture: retirementData.retirementAge,
        miesieczny_dochod: retirementData.monthlyIncome,
        przerwy_w_karierze: retirementData.careerBreaks,
        dni_zwolnien: retirementData.sickLeaveDays,
        waloryzacja: retirementData.valorization,
        inflacja: retirementData.inflation,
        aktualna_wyplata: retirementData.actualSalary,
        lata_do_emerytury: retirementData.yearsToRetirement,
        przyszla_emerytura_realna: retirementData.futurePensionReal,
        przyszla_emerytura_nominalna: retirementData.futurePensionNominal,
        srednia_krajowa_emerytura: retirementData.avgNationalPension,
        roznica_procent: retirementData.percentDifference,
        emerytura_z_kalkulatora_nominalna: retirementData.apiPensionNominal,
        emerytura_z_kalkulatora_realna: retirementData.apiPensionReal,
        status_pogody: retirementData.weatherStatus,
        opis_pogody: retirementData.weatherDescription,
      };

      console.log('Generating recommendations with context:', dashboardContext);

      const { data, error } = await supabase.functions.invoke('generate-retirement-recommendations', {
        body: { retirementData: dashboardContext }
      });

      console.log('Recommendations response:', { data, error });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się wygenerować rekomendacji",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !recommendations && !isLoading) {
      generateRecommendations();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Rekomendacje AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommender — co możesz zrobić dziś
          </DialogTitle>
          <DialogDescription>
            Personalizowane rekomendacje na podstawie analizy Twojego raportu emerytalnego
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analizuję Twój raport i generuję rekomendacje...</p>
          </div>
        ) : recommendations ? (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-lg">📈 Twoje spersonalizowane rekomendacje</CardTitle>
              <CardDescription>
                Posortowane od największego do najmniejszego wpływu na emeryturę
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recommendations.split('\n').filter(line => line.trim()).map((rec, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in border border-border/50"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex-1 text-sm leading-relaxed">
                      {rec}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={generateRecommendations} 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  Wygeneruj nowe rekomendacje
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
