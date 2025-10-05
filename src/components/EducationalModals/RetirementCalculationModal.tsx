import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calculator, TrendingUp, Percent, Calendar } from "lucide-react";

interface RetirementCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementCalculationModal: React.FC<RetirementCalculationModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Jak obliczana jest emerytura?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-gradient-to-br from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--green-primary))]/10 p-6 rounded-lg border border-[hsl(var(--blue-primary))]/20">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">System składkowy w Polsce</h3>
            <p className="text-gray-700 leading-relaxed">
              W Polsce funkcjonuje system emerytalny oparty na składkach. Oznacza to, że wysokość Twojej emerytury 
              zależy od tego, ile i przez jak długi czas wpłacałeś składek do systemu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[hsl(var(--blue-primary))]/30 p-5 rounded-lg hover:border-[hsl(var(--blue-primary))] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[hsl(var(--blue-primary))]/10 p-2 rounded-lg">
                  <Percent className="w-5 h-5 text-[hsl(var(--blue-primary))]" />
                </div>
                <h4 className="font-semibold text-gray-900">Wysokość składki</h4>
              </div>
              <p className="text-gray-700 text-sm">
                19,52% Twojego wynagrodzenia brutto trafia na konto emerytalne (składka jest dzielona między 
                pracodawcę i pracownika).
              </p>
            </div>

            <div className="bg-white border-2 border-[hsl(var(--green-primary))]/30 p-5 rounded-lg hover:border-[hsl(var(--green-primary))] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[hsl(var(--green-primary))]/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--green-primary))]" />
                </div>
                <h4 className="font-semibold text-gray-900">Waloryzacja</h4>
              </div>
              <p className="text-gray-700 text-sm">
                Zgromadzone środki są corocznie waloryzowane (indeksowane) o wskaźnik określany przez ZUS.
              </p>
            </div>

            <div className="bg-white border-2 border-[hsl(var(--blue-primary))]/30 p-5 rounded-lg hover:border-[hsl(var(--blue-primary))] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[hsl(var(--blue-primary))]/10 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-[hsl(var(--blue-primary))]" />
                </div>
                <h4 className="font-semibold text-gray-900">Wiek emerytalny</h4>
              </div>
              <p className="text-gray-700 text-sm">
                W Polsce wynosi 60 lat dla kobiet i 65 lat dla mężczyzn, ale można przejść na emeryturę później.
              </p>
            </div>

            <div className="bg-white border-2 border-[hsl(var(--green-primary))]/30 p-5 rounded-lg hover:border-[hsl(var(--green-primary))] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[hsl(var(--green-primary))]/10 p-2 rounded-lg">
                  <Calculator className="w-5 h-5 text-[hsl(var(--green-primary))]" />
                </div>
                <h4 className="font-semibold text-gray-900">Średnia długość życia</h4>
              </div>
              <p className="text-gray-700 text-sm">
                Kapitał emerytalny dzieli się przez średnią długość życia Twojego pokolenia.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--green-primary))]/10 border-l-4 border-[hsl(var(--blue-primary))] p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Wzór uproszczony:</h4>
            <div className="bg-white p-4 rounded font-mono text-sm text-center border border-[hsl(var(--blue-primary))]/20">
              Emerytura = <span className="text-[hsl(var(--blue-primary))] font-bold">Kapitał emerytalny</span> / <span className="text-[hsl(var(--green-primary))] font-bold">Średnia długość życia</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--green-primary))]/10 to-[hsl(var(--blue-primary))]/10 p-5 rounded-lg border border-[hsl(var(--green-primary))]/20">
            <h4 className="font-semibold text-gray-900 mb-3">Co wpływa na wysokość emerytury?</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Wysokość zarobków</strong> - im więcej zarabiasz, tym więcej trafia na konto emerytalne</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Długość kariery</strong> - im dłużej pracujesz, tym więcej zgromadzisz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Przerwy w karierze</strong> - urlopy bezpłatne, przerwy między pracami obniżają kapitał</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Wiek przejścia na emeryturę</strong> - im później, tym wyższa emerytura miesięczna</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
