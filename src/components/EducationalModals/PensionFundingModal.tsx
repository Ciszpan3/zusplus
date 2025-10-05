import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, Users, Building2, Banknote } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PensionFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PensionFundingModal: React.FC<PensionFundingModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Data showing breakdown of pension funding sources
  const fundingData = [
    { name: "Składki pracowników", value: 40, color: "hsl(var(--primary))" },
    { name: "Składki pracodawców", value: 40, color: "hsl(var(--secondary))" },
    { name: "Waloryzacja", value: 15, color: "hsl(var(--accent))" },
    { name: "Dotacje budżetowe", value: 5, color: "hsl(var(--muted))" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Skąd brane są pieniądze na emeryturę?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">System składkowy</h3>
            <p className="text-gray-700 leading-relaxed">
              Twoja przyszła emerytura finansowana jest głównie ze składek, które odprowadzane są przez cały 
              okres Twojej aktywności zawodowej. To swego rodzaju "konto oszczędnościowe" zarządzane przez ZUS.
            </p>
          </div>

          <div className="bg-white border-2 border-primary/20 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">
              Struktura finansowania emerytury
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fundingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fundingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                  formatter={(value: number) => [`${value}%`, 'Udział']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-primary/20 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Składka pracownika</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Część Twojego wynagrodzenia brutto (około 9,76%) automatycznie trafia na Twoje konto emerytalne w ZUS.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Składka pracodawcy</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Twój pracodawca dopłaca dodatkowe 9,76% od Twojego wynagrodzenia, co podwaja wpłaty na Twoje konto.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Banknote className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Waloryzacja</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Zgromadzone środki są corocznie waloryzowane według wskaźnika ZUS, co zwiększa wartość Twojego kapitału.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Dotacje budżetowe</h4>
              </div>
              <p className="text-gray-600 text-sm">
                W niektórych przypadkach (np. minimalna emerytura) państwo dopłaca z budżetu różnicę.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <h4 className="font-semibold text-amber-900 mb-2">Ważne!</h4>
            <p className="text-gray-700 text-sm">
              Łącznie na Twoje konto emerytalne trafia <strong>19,52%</strong> Twojego wynagrodzenia brutto 
              (9,76% z Twojej pensji + 9,76% od pracodawcy). Im wyższa pensja i dłuższa kariera, tym więcej 
              zgromadzisz na emeryturę.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Jak zwiększyć swoją emeryturę?</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Pracuj legalnie</strong> - tylko oficjalne zatrudnienie buduje Twój kapitał emerytalny</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Zwiększaj zarobki</strong> - wyższe wynagrodzenie = wyższe składki</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Unikaj długich przerw</strong> - każdy rok bez pracy to brak wpłat na konto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Rozważ III filar (PPE, IKE)</strong> - dodatkowe oszczędności emerytalne z ulgami podatkowymi</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
