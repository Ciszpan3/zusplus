import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Sun, TrendingUp, Plane, Briefcase, Umbrella, Info, Calculator, MapPin, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PrognosiResponse } from '@/services/api';

const Results: React.FC = () => {
  const location = useLocation();
  const prognosisData = location.state?.prognosisData as PrognosiResponse | undefined;
  
  const [retirementAge, setRetirementAge] = useState(67);
  const [monthlyIncome, setMonthlyIncome] = useState(8500);
  const [yearsInCareer, setYearsInCareer] = useState(0);

  // Use real data if available, otherwise fallback to dummy data
  const actualSalary = prognosisData?.aktualna_wyplata || 8500;
  const yearsToRetirement = prognosisData?.lata_do_emerytury || 42;
  const futurePensionReal = prognosisData?.przyszla_emerytura_realna || 4890;
  const futurePensionNominal = prognosisData?.przyszla_emerytura_nominalna || 4890;
  const avgNationalPension = prognosisData?.srednia_krajowa_emerytura || 3200;
  const percentDifference = prognosisData?.roznica_procent || 53;
  const funFacts = prognosisData?.ciekawostki || [
    "1. Regularne oszczędzanie to klucz do komfortowej emerytury.",
    "2. System emerytalny działa na zasadzie pokoleniowej solidarności.",
    "3. Warto rozważyć dodatkowe oszczędności w III filarze."
  ];
  return <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          
          <h1 className="text-white text-4xl font-bold mb-12">Twoja przyszłość prezentuje się tak...</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">Twój profil</h3>
                  <p className="text-gray-500 text-sm">25 Lat</p>
                </div>
              </div>
                <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Aktualna wypłata</span>
                  <span className="text-blue-600 font-bold">{actualSalary.toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Lata do emerytury</span>
                  <span className="text-blue-600 font-bold">{yearsToRetirement} {yearsToRetirement === 1 ? 'rok' : yearsToRetirement < 5 ? 'lata' : 'lat'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Przyszła emerytura (realna)</span>
                  <span className="text-blue-600 font-bold">{Math.round(futurePensionReal).toLocaleString('pl-PL')} PLN/m-c</span>
                </div>
              </div>
            </div>

            {/* Weather Forecast Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Mając 67 lat
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-3">Pogoda Emerytury</h3>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sun className="w-8 h-8 text-yellow-400" />
                  <span className="text-gray-900 font-semibold text-lg">Słonecznie</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">Prognozowane słońce</p>
                <p className="text-gray-600 text-sm">bezpieczeństwo finansowe</p>
              </div>
            </div>

            {/* Quick Comparison Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Szybkie porównanie</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Twoja przyszła emerytura</span>
                    <span className="text-blue-600 font-bold">{Math.round(futurePensionReal).toLocaleString('pl-PL')} PLN</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{
                    width: `${Math.min(100, (futurePensionReal / avgNationalPension) * 50)}%`
                  }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Średnia krajowa</span>
                    <span className="text-gray-900 font-bold">{Math.round(avgNationalPension).toLocaleString('pl-PL')} PLN</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{
                    width: '40%'
                  }}></div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg mt-4 ${percentDifference >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-gray-600 text-xs mb-1">Twoja emerytura byłaby</p>
                  <p className={`font-bold text-lg ${percentDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {percentDifference > 0 ? '+' : ''}{percentDifference.toFixed(1)}% {percentDifference >= 0 ? 'wyższa' : 'niższa'} od średniej!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-gray-900 text-3xl font-bold mb-3">Scenariusze</h2>
            <p className="text-gray-600">Baw się różnymi scenariuszami i zobacz, jak wpłyną one na Twoją przyszłość</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Life Choices */}
            <div>
              <h3 className="text-blue-900 text-xl font-semibold mb-6">Wpływ wyborów życiowych</h3>
              <div className="space-y-4">
                {/* Scenario 1 */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold mb-1">Chcesz sobie zrobić dwa lata przerwy?</h4>
                      <p className="text-gray-500 text-sm mb-3">W wieku 30 lat</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pension Impact</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-red-200 h-2 rounded-full"></div>
                            <span className="text-red-600 font-semibold text-sm">-6% (-294 PLN)</span>
                          </div>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors">
                          Wyróbuj
                        </button>
                      </div>
                      <div className="mt-3 text-right">
                        <p className="text-sm text-gray-600">Emerytura</p>
                        <p className="text-blue-600 font-bold">4,596 PLN</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold mb-1">Zmiana na lepiej płatną pracę?</h4>
                      <p className="text-gray-500 text-sm mb-3">+15% wzrost wypłaty</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Wzrost emerytury</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-green-200 h-2 rounded-full"></div>
                            <span className="text-green-600 font-semibold text-sm">+7% (+342 PLN)</span>
                          </div>
                        </div>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors">
                          Akceptuj
                        </button>
                      </div>
                      <div className="mt-3 text-right">
                        <p className="text-sm text-gray-600">Emerytura</p>
                        <p className="text-blue-600 font-bold">5,232 PLN</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Umbrella className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold mb-1">Pracuj dwa lata dłużej?</h4>
                      <p className="text-gray-500 text-sm mb-3">Przejdź na emeryturę w wieku 69 lat, a nie 67</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Miesięczny wzrost</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-orange-200 h-2 rounded-full"></div>
                            <span className="text-orange-600 font-semibold text-sm">+420 PLN</span>
                          </div>
                        </div>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors">
                          Rozważ
                        </button>
                      </div>
                      <div className="mt-3 text-right">
                        <p className="text-sm text-gray-600">Emerytura</p>
                        <p className="text-blue-600 font-bold">5,310 PLN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Simulation */}
            <div>
              <h3 className="text-blue-900 text-xl font-semibold mb-6">Sterowanie symulacja na żywo</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="space-y-6">
                  {/* Retirement Age Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-gray-700 text-sm font-medium">Wiek emerytalny</label>
                      <span className="text-blue-600 font-bold text-lg">{retirementAge} lat</span>
                    </div>
                    <input type="range" min="60" max="70" value={retirementAge} onChange={e => setRetirementAge(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>60</span>
                      <span>70</span>
                    </div>
                  </div>

                  {/* Monthly Income Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-gray-700 text-sm font-medium">Miesięczny dochód</label>
                      <span className="text-blue-600 font-bold text-lg">{monthlyIncome.toLocaleString()} PLN</span>
                    </div>
                    <input type="range" min="4242" max="15000" value={monthlyIncome} onChange={e => setMonthlyIncome(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>4.2K</span>
                      <span>15K</span>
                    </div>
                  </div>

                  {/* Career Years Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-gray-700 text-sm font-medium">Przerwy w karierze (lata)</label>
                      <span className="text-blue-600 font-bold text-lg">{yearsInCareer} lat</span>
                    </div>
                    <input type="range" min="0" max="5" value={yearsInCareer} onChange={e => setYearsInCareer(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mt-6">
                    <p className="text-gray-600 text-sm text-center mb-2">Przewidywana emerytura (realna)</p>
                    <p className="text-blue-900 text-4xl font-bold text-center">{Math.round(futurePensionReal).toLocaleString('pl-PL')} PLN</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Szczegóły
                    </button>
                    <button className="bg-white border-2 border-orange-400 text-orange-500 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-bold mb-3">Wiedziałeś że?</h2>
            <p className="text-white/90">Uczysz się, odkrywając swoją przyszłość</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-3">Każdy dodatkowy rok się liczy</h3>
              <p className="text-gray-600 text-sm mb-4">
                Już po roku dodatkowej pracy Twoja emerytura wzrośnie o około 8%.
              </p>
              <p className="text-orange-600 font-bold text-xl">+8% co rok</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-3">Most Pokoleniowy</h3>
              <p className="text-gray-600 text-sm mb-4">
                Twoje dzisiejsze składki wspierają obecnych emerytów, tak jak przyszli pracownicy będą wspierać Ciebie.
              </p>
              <p className="text-green-600 font-bold text-lg">Social solidarity</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-3">Więcej niż emerytura</h3>
              <p className="text-gray-600 text-sm mb-4">
                ZUS chroni Cię przed chorobą, niepełnosprawnością i zapewnia urlop macierzyński - nie tylko emeryturę.
              </p>
              <p className="text-red-600 font-bold text-lg">Full protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 text-3xl font-bold mb-3">Ciekawostki</h2>
            <p className="text-gray-600">Dowiedz się czegoś nowego</p>
          </div>

          <div className="grid md:grid-cols-1 gap-6 max-w-5xl mx-auto">
            {funFacts.map((fact, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Results;