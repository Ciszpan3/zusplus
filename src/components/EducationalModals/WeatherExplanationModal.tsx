import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Info } from "lucide-react";

interface WeatherExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherExplanationModal: React.FC<WeatherExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const weatherTypes = [
    {
      icon: Sun,
      name: "Słonecznie",
      color: "text-yellow-400",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-400",
      condition: ">30%",
      description: "Twoja emerytura znacznie przewyższa średnią krajową! Jesteś w świetnej sytuacji finansowej na emeryturze.",
      iconBg: "bg-yellow-400"
    },
    {
      icon: CloudSun,
      name: "Częściowo słonecznie",
      color: "text-yellow-500",
      bgColor: "from-yellow-50 to-blue-50",
      borderColor: "border-yellow-500",
      condition: "0% do 30%",
      description: "Twoja emerytura jest powyżej średniej krajowej. Masz dobrą bazę, ale zawsze można dążyć do lepszych wyników.",
      iconBg: "bg-yellow-500"
    },
    {
      icon: Cloud,
      name: "Pochmurnie",
      color: "text-gray-400",
      bgColor: "from-gray-50 to-slate-50",
      borderColor: "border-gray-400",
      condition: "-15% do 0%",
      description: "Twoja emerytura jest zbliżona do średniej krajowej. Warto rozważyć dodatkowe oszczędności emerytalne.",
      iconBg: "bg-gray-400"
    },
    {
      icon: CloudRain,
      name: "Deszczowo",
      color: "text-blue-400",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-400",
      condition: "-40% do -15%",
      description: "Twoja emerytura jest poniżej średniej krajowej. Rozważ zwiększenie składek lub III filar emerytalny (PPE, IKE).",
      iconBg: "bg-blue-400"
    },
    {
      icon: CloudLightning,
      name: "Burzowo",
      color: "text-purple-400",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-400",
      condition: "<-40%",
      description: "Twoja emerytura jest znacznie poniżej średniej. Pilnie potrzebujesz planu zabezpieczenia przyszłości finansowej.",
      iconBg: "bg-purple-400"
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--blue-primary))] flex items-center gap-2">
            <Info className="w-6 h-6" />
            Czym jest "Pogoda Emerytury"?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-gradient-to-br from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--green-primary))]/10 p-6 rounded-lg border border-[hsl(var(--blue-primary))]/20">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Jak rozumiemy "Pogodę Emerytury"?</h3>
            <p className="text-gray-700 leading-relaxed">
              "Pogoda Emerytury" to prosty, intuicyjny sposób na zobrazowanie Twojej sytuacji emerytalnej 
              w porównaniu do średniej krajowej. Tak jak pogoda wpływa na Twój dzień, tak wysokość emerytury 
              wpływa na komfort Twojego życia na emeryturze.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Rodzaje pogody emerytalnej:</h4>
            
            {weatherTypes.map((weather, index) => {
              const WeatherIcon = weather.icon;
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-r ${weather.bgColor} p-5 rounded-lg border-l-4 ${weather.borderColor} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${weather.iconBg} p-3 rounded-lg flex-shrink-0`}>
                      <WeatherIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-gray-900 text-lg">{weather.name}</h5>
                        <span className="text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                          {weather.condition}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {weather.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-[hsl(var(--blue-primary))]/10 to-[hsl(var(--green-primary))]/10 p-5 rounded-lg border border-[hsl(var(--green-primary))]/20">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[hsl(var(--blue-primary))]" />
              Jak to jest obliczane?
            </h4>
            <p className="text-gray-700 text-sm mb-3">
              Porównujemy Twoją prognozowaną emeryturę ze średnią krajową emeryturą i obliczamy różnicę procentową:
            </p>
            <div className="bg-white p-4 rounded border border-[hsl(var(--blue-primary))]/20 font-mono text-sm text-center">
              Różnica = <span className="text-[hsl(var(--blue-primary))] font-bold">(Twoja emerytura - Średnia krajowa)</span> / <span className="text-[hsl(var(--green-primary))] font-bold">Średnia krajowa</span> × 100%
            </div>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--green-primary))]/10 to-[hsl(var(--blue-primary))]/10 p-5 rounded-lg border border-[hsl(var(--green-primary))]/20">
            <h4 className="font-semibold text-gray-900 mb-3">Co możesz zrobić, aby poprawić swoją "pogodę"?</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Pracuj dłużej</strong> - każdy rok pracy zwiększa Twój kapitał emerytalny</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Zwiększaj wynagrodzenie</strong> - wyższe zarobki = wyższe składki emerytalne</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Unikaj przerw w karierze</strong> - ciągłość pracy buduje solidny kapitał</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--green-primary))] mt-1 text-lg">•</span>
                <span><strong>Rozważ dodatkowe oszczędności</strong> - PPE, IKE, IKZE to świetne uzupełnienie ZUS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(var(--blue-primary))] mt-1 text-lg">•</span>
                <span><strong>Przejdź na emeryturę później</strong> - opóźnienie emerytury znacząco zwiększa miesięczne świadczenie</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
