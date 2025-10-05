import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';

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


const GRADIENT_COLORS = [
  'from-purple-500/20 to-pink-500/20 border-purple-200',
  'from-blue-500/20 to-cyan-500/20 border-blue-200',
  'from-green-500/20 to-emerald-500/20 border-green-200',
  'from-orange-500/20 to-red-500/20 border-orange-200',
  'from-indigo-500/20 to-purple-500/20 border-indigo-200',
];

const formatRecommendation = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
};

export const AIRecommendations = ({ retirementData }: AIRecommendationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setIsLoading(true);
    setRecommendations([]);

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

      const recs = data.recommendations.split('\n').filter((line: string) => line.trim());
      setRecommendations(recs);
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
    if (open && recommendations.length === 0 && !isLoading) {
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommender — co możesz zrobić dziś
          </DialogTitle>
          <DialogDescription>
            Personalizowane rekomendacje oparte na analizie Twojego raportu emerytalnego
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Analizuję Twój raport i generuję rekomendacje...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="py-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Twoje spersonalizowane rekomendacje</h3>
            </div>
            
            <Carousel className="w-full max-w-3xl mx-auto">
              <CarouselContent>
                {recommendations.map((rec, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/2">
                    <Card className={`h-full bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} border-2 shadow-lg hover:shadow-xl transition-all animate-fade-in`}
                          style={{ animationDelay: `${idx * 150}ms` }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-white/90 p-3 rounded-full shadow-md">
                            <TrendingUp className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base leading-relaxed">
                              <span 
                                className="text-gray-700"
                                dangerouslySetInnerHTML={{ __html: formatRecommendation(rec) }}
                              />
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/80">
                          <p className="text-xs text-gray-600 font-medium">
                            Rekomendacja #{idx + 1} • Oparta na AI
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 hover:bg-white" />
              <CarouselNext className="bg-white/90 hover:bg-white" />
            </Carousel>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={generateRecommendations} 
                variant="outline" 
                className="gap-2 border-2 hover:bg-primary/5"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
                Wygeneruj nowe rekomendacje
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
