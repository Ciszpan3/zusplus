import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingDown, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface InflationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InflationModal: React.FC<InflationModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Data showing purchasing power decline over 30 years with 3% inflation
  const inflationData = [
    { year: "Dziś", value: 100, realValue: 100 },
    { year: "5 lat", value: 100, realValue: 86.3 },
    { year: "10 lat", value: 100, realValue: 74.4 },
    { year: "15 lat", value: 100, realValue: 64.2 },
    { year: "20 lat", value: 100, realValue: 55.4 },
    { year: "25 lat", value: 100, realValue: 47.8 },
    { year: "30 lat", value: 100, realValue: 41.2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            Jak działa inflacja?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-gradient-to-br from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--green-primary))]/10 p-6 rounded-lg border border-[hsl(var(--blue-primary))]/20">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Co to jest inflacja?</h3>
            <p className="text-gray-700 leading-relaxed">
              Inflacja to wzrost ogólnego poziomu cen towarów i usług w gospodarce. Oznacza to, że za tę samą 
              kwotę pieniędzy możesz kupić mniej niż w przeszłości. Innymi słowy - siła nabywcza pieniądza maleje.
            </p>
          </div>

          <div className="bg-white border-2 border-[hsl(var(--blue-primary))]/30 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="bg-[hsl(var(--blue-primary))]/10 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-[hsl(var(--blue-primary))]" />
              </div>
              Wartość 100 PLN w czasie przy inflacji 3% rocznie
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={inflationData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--blue-primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--green-primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))" 
                  domain={[0, 100]}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '2px solid hsl(var(--blue-primary))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} PLN`, 'Realna wartość']}
                />
                <Area 
                  type="monotone" 
                  dataKey="realValue" 
                  stroke="hsl(var(--blue-primary))" 
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-700 mt-3 text-center font-medium">
              Przy inflacji 3% rocznie, 100 PLN po 30 latach będzie warte tyle, co dziś 41,20 PLN
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--blue-primary))]/5 p-5 rounded-lg border-l-4 border-[hsl(var(--blue-primary))]">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[hsl(var(--blue-primary))]" />
                Przykład
              </h4>
              <p className="text-gray-700 text-sm">
                Jeśli dzisiaj kawa kosztuje 10 PLN, przy inflacji 3% rocznie za 10 lat będzie kosztować około 13,44 PLN.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(var(--green-primary))]/10 to-[hsl(var(--green-primary))]/5 p-5 rounded-lg border-l-4 border-[hsl(var(--green-primary))]">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[hsl(var(--green-primary))]" />
                Dla Twojej emerytury
              </h4>
              <p className="text-gray-700 text-sm">
                Dlatego emerytura "nominalna" (kwota w PLN) różni się od "realnej" (uwzględniającej inflację).
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--green-primary))]/10 to-[hsl(var(--blue-primary))]/10 p-5 rounded-lg border border-[hsl(var(--green-primary))]/20">
            <h4 className="font-semibold text-gray-900 mb-3">Co możesz zrobić?</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Inwestuj</strong> - lokaty i oszczędności powinny przynajmniej pokrywać inflację</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Planuj długoterminowo</strong> - uwzględniaj inflację w planowaniu emerytury</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Zwiększaj dochody</strong> - regularnie negocjuj podwyżki zgodne z inflacją</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Dywersyfikuj oszczędności</strong> - różne formy inwestycji chronią przed inflacją</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
