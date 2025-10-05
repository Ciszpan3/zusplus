import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  User,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  TrendingUp,
  Plane,
  Briefcase,
  Umbrella,
  Info,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrognosiResponse } from "@/services/api";
import { DashboardAIChat } from "@/components/DashboardAIChat";
import { AIRecommendations } from "@/components/AIRecommendations";

const Results: React.FC = () => {
  const location = useLocation();
  const prognosisData = location.state?.prognosisData as
    | PrognosiResponse
    | undefined;
  const formData = location.state?.formData as any;

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });

    const w = window as any;
    if (!w.html2canvas) {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
      );
    }
    if (!w.jspdf) {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
      );
    }

    const html2canvas = w.html2canvas as (
      element: HTMLElement,
      opts?: any
    ) => Promise<HTMLCanvasElement>;
    const { jsPDF } = w.jspdf as { jsPDF: any };

    if (!contentRef.current) return;
    const element = contentRef.current;

    // Higher scale for better quality and detail preservation
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowHeight: element.scrollHeight,
      windowWidth: element.scrollWidth,
      backgroundColor: "#f9fafb",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaling to fit content properly
    const padding = 5; // Reduced padding for more content space
    const availableWidth = pdfWidth - padding * 2;
    const availableHeight = pdfHeight - padding * 2;

    // Calculate the ratio to fit the image properly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = availableWidth / availableHeight;

    let imgWidth = availableWidth;
    let imgHeight = availableWidth / canvasAspectRatio;

    // If the calculated height is too tall, scale down
    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = availableHeight * canvasAspectRatio;
    }

    let remainingHeight = imgHeight;
    let sourceYPosition = 0;

    // Calculate how much of the source image fits on one page
    const pageImageHeight = (availableHeight / imgHeight) * canvas.height;

    while (remainingHeight > 0) {
      const pageHeight = Math.min(availableHeight, remainingHeight);
      const sourceHeight = (pageHeight / imgHeight) * canvas.height;

      // Create a temporary canvas for this page's content
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      const ctx = pageCanvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceYPosition,
          canvas.width,
          sourceHeight,
          0,
          0,
          canvas.width,
          sourceHeight
        );

        const pageImgData = pageCanvas.toDataURL("image/png", 1.0);

        if (sourceYPosition > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          pageImgData,
          "PNG",
          padding,
          padding,
          imgWidth,
          pageHeight
        );
      }

      sourceYPosition += sourceHeight;
      remainingHeight -= pageHeight;
    }

    pdf.save("raport-emerytury.pdf");
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Default values from formData or fallback to defaults
  const DEFAULT_AGE = formData?.age ? parseInt(formData.age) : 27;
  const DEFAULT_GENDER: "female" | "male" = formData?.gender || "female";
  const currentYear = new Date().getFullYear();
  const DEFAULT_RETIREMENT_AGE = formData?.retirementYear
    ? parseInt(formData.retirementYear) - currentYear + DEFAULT_AGE
    : 67;
  const DEFAULT_MONTHLY_INCOME = formData?.monthlyIncome
    ? parseFloat(formData.monthlyIncome)
    : 8500;
  const DEFAULT_CAREER_BREAKS = 0;
  const DEFAULT_SICK_LEAVE_DAYS = formData?.sickLeaveDays
    ? parseInt(formData.sickLeaveDays)
    : 19;
  const DEFAULT_VALORIZATION = 1;
  const DEFAULT_INFLATION = 0;

  const [age, setAge] = useState(DEFAULT_AGE);
  const [gender, setGender] = useState<"female" | "male">(DEFAULT_GENDER);
  const [retirementAge, setRetirementAge] = useState(DEFAULT_RETIREMENT_AGE);
  const [monthlyIncome, setMonthlyIncome] = useState(DEFAULT_MONTHLY_INCOME);
  const [careerBreaks, setCareerBreaks] = useState(DEFAULT_CAREER_BREAKS);
  const [sickLeaveDays, setSickLeaveDays] = useState(DEFAULT_SICK_LEAVE_DAYS);
  const [valorization, setValorization] = useState(DEFAULT_VALORIZATION);
  const [inflation, setInflation] = useState(DEFAULT_INFLATION);
  const [apiPensionNominal, setApiPensionNominal] = useState<number | null>(
    null
  );
  const [apiPensionReal, setApiPensionReal] = useState<number | null>(null);

  // State for projected chart (left chart) - initially uses API data
  const [projectedPensionNominal, setProjectedPensionNominal] = useState<
    number | null
  >(null);
  const [projectedPensionReal, setProjectedPensionReal] = useState<
    number | null
  >(null);

  // State for projected chart bar heights
  const [projectedBarHeightNominal, setProjectedBarHeightNominal] =
    useState<number>(120);
  const [projectedBarHeightReal, setProjectedBarHeightReal] =
    useState<number>(80);

  // State for calculated chart bar heights (right chart)
  const [calculatedBarHeightNominal, setCalculatedBarHeightNominal] =
    useState<number>(120);
  const [calculatedBarHeightReal, setCalculatedBarHeightReal] =
    useState<number>(120);

  // Use real data if available, otherwise fallback to dummy data
  const actualSalary = prognosisData?.aktualna_wyplata || 8500;
  const yearsToRetirement = prognosisData?.lata_do_emerytury || 42;
  const futurePensionReal =
    projectedPensionReal || prognosisData?.przyszla_emerytura_realna || 4890;
  const futurePensionNominal =
    projectedPensionNominal ||
    prognosisData?.przyszla_emerytura_nominalna ||
    4890;
  const avgNationalPension = prognosisData?.srednia_krajowa_emerytura || 3200;
  const percentDifference = prognosisData?.roznica_procent || 53;
  const ileLat = prognosisData?.ile_lat;

  // Determine weather based on percentage difference
  const getWeatherInfo = () => {
    if (percentDifference > 30) {
      return {
        icon: Sun,
        text: "Słonecznie",
        description: "Twoja emerytura znacznie przewyższa średnią krajową!",
        color: "text-yellow-400",
      };
    } else if (percentDifference > 0) {
      return {
        icon: CloudSun,
        text: "Częściowo słonecznie",
        description: "Twoja emerytura jest powyżej średniej krajowej",
        color: "text-yellow-500",
      };
    } else if (percentDifference > -15) {
      return {
        icon: Cloud,
        text: "Pochmurnie",
        description: "Twoja emerytura jest zbliżona do średniej krajowej",
        color: "text-gray-400",
      };
    } else if (percentDifference > -40) {
      return {
        icon: CloudRain,
        text: "Deszczowo",
        description: "Twoja emerytura jest poniżej średniej krajowej",
        color: "text-blue-400",
      };
    } else {
      return {
        icon: CloudLightning,
        text: "Burzowo",
        description: "Twoja emerytura jest znacznie poniżej średniej",
        color: "text-purple-400",
      };
    }
  };

  const weatherInfo = getWeatherInfo();
  const WeatherIcon = weatherInfo.icon;

  // Calculate bar heights with max limit (256px container - some padding)
  const MAX_CHART_HEIGHT = 250; // Maximum height for chart bars
  const MIN_CHART_HEIGHT = 30; // Minimum height for chart bars
  const calculateBarHeight = (
    value: number,
    referenceValue: number,
    baseHeight: number
  ) => {
    const calculatedHeight = (value / referenceValue) * baseHeight;
    return Math.max(
      MIN_CHART_HEIGHT,
      Math.min(calculatedHeight, MAX_CHART_HEIGHT)
    );
  };

  // Handle "Oblicz" button click - copy calculated values to projected chart
  const handleCalculate = () => {
    if (apiPensionNominal && apiPensionReal) {
      // Copy values
      setProjectedPensionNominal(apiPensionNominal);
      setProjectedPensionReal(apiPensionReal);

      // Copy the EXACT bar heights from right chart to left chart
      setProjectedBarHeightNominal(calculatedBarHeightNominal);
      setProjectedBarHeightReal(calculatedBarHeightReal);
    }
  };

  // Handle "Reset" button click - reset all sliders and inputs to default values
  const handleReset = () => {
    setAge(DEFAULT_AGE);
    setGender(DEFAULT_GENDER);
    setRetirementAge(DEFAULT_RETIREMENT_AGE);
    setMonthlyIncome(DEFAULT_MONTHLY_INCOME);
    setCareerBreaks(DEFAULT_CAREER_BREAKS);
    setSickLeaveDays(DEFAULT_SICK_LEAVE_DAYS);
    setValorization(DEFAULT_VALORIZATION);
    setInflation(DEFAULT_INFLATION);
    // Reset projected chart to original API data
    setProjectedPensionNominal(null);
    setProjectedPensionReal(null);

    // Reset bar heights to original proportional values
    if (prognosisData) {
      const nominalValue = prognosisData.przyszla_emerytura_nominalna || 4890;
      const realValue = prognosisData.przyszla_emerytura_realna || 4890;

      // Calculate heights so their sum equals MAX_CHART_HEIGHT
      const totalValue = nominalValue + realValue;

      let nominalHeight = (nominalValue / totalValue) * MAX_CHART_HEIGHT;
      let realHeight = (realValue / totalValue) * MAX_CHART_HEIGHT;

      // Ensure minimum height of 30px for both
      nominalHeight = Math.max(MIN_CHART_HEIGHT, nominalHeight);
      realHeight = Math.max(MIN_CHART_HEIGHT, realHeight);

      // If both are at minimum, adjust proportionally
      if (
        nominalHeight === MIN_CHART_HEIGHT &&
        realHeight === MIN_CHART_HEIGHT
      ) {
        const remaining = MAX_CHART_HEIGHT - MIN_CHART_HEIGHT * 2;
        const ratio = nominalValue / totalValue;
        nominalHeight = MIN_CHART_HEIGHT + remaining * ratio;
        realHeight = MIN_CHART_HEIGHT + remaining * (1 - ratio);
      }

      setProjectedBarHeightNominal(nominalHeight);
      setProjectedBarHeightReal(realHeight);
    }
  };

  // Update calculated chart bar heights when API data changes
  useEffect(() => {
    if (apiPensionNominal && apiPensionReal) {
      // Calculate heights so their sum equals MAX_CHART_HEIGHT
      const totalValue = apiPensionNominal + apiPensionReal;

      // Each bar gets a portion of MAX_CHART_HEIGHT proportional to its value
      let nominalHeight = (apiPensionNominal / totalValue) * MAX_CHART_HEIGHT;
      let realHeight = (apiPensionReal / totalValue) * MAX_CHART_HEIGHT;

      // Ensure minimum height of 30px for both
      nominalHeight = Math.max(MIN_CHART_HEIGHT, nominalHeight);
      realHeight = Math.max(MIN_CHART_HEIGHT, realHeight);

      // If both are at minimum, adjust proportionally
      if (
        nominalHeight === MIN_CHART_HEIGHT &&
        realHeight === MIN_CHART_HEIGHT
      ) {
        const remaining = MAX_CHART_HEIGHT - MIN_CHART_HEIGHT * 2;
        const ratio = apiPensionNominal / totalValue;
        nominalHeight = MIN_CHART_HEIGHT + remaining * ratio;
        realHeight = MIN_CHART_HEIGHT + remaining * (1 - ratio);
      }

      setCalculatedBarHeightNominal(nominalHeight);
      setCalculatedBarHeightReal(realHeight);
    }
  }, [
    apiPensionNominal,
    apiPensionReal,
    prognosisData?.przyszla_emerytura_realna,
  ]);

  // Update projected chart bar heights based on initial data
  useEffect(() => {
    if (prognosisData) {
      const nominalValue = prognosisData.przyszla_emerytura_nominalna || 4890;
      const realValue = prognosisData.przyszla_emerytura_realna || 4890;

      // Calculate heights so their sum equals MAX_CHART_HEIGHT
      const totalValue = nominalValue + realValue;

      // Each bar gets a portion of MAX_CHART_HEIGHT proportional to its value
      let nominalHeight = (nominalValue / totalValue) * MAX_CHART_HEIGHT;
      let realHeight = (realValue / totalValue) * MAX_CHART_HEIGHT;

      // Ensure minimum height of 30px for both
      nominalHeight = Math.max(MIN_CHART_HEIGHT, nominalHeight);
      realHeight = Math.max(MIN_CHART_HEIGHT, realHeight);

      // If both are at minimum, adjust proportionally
      if (
        nominalHeight === MIN_CHART_HEIGHT &&
        realHeight === MIN_CHART_HEIGHT
      ) {
        const remaining = MAX_CHART_HEIGHT - MIN_CHART_HEIGHT * 2;
        const ratio = nominalValue / totalValue;
        nominalHeight = MIN_CHART_HEIGHT + remaining * ratio;
        realHeight = MIN_CHART_HEIGHT + remaining * (1 - ratio);
      }

      setProjectedBarHeightNominal(nominalHeight);
      setProjectedBarHeightReal(realHeight);
    }
  }, [prognosisData]);

  // Debounced API call for calculator
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchCalculatedPension = async () => {
        const requestBody = {
          wiek: age,
          plec: gender === "female" ? "kobieta" : "mezczyzna",
          wiek_przejscia_na_emeryture: retirementAge,
          miesieczny_dochod: monthlyIncome,
          przerwy_w_kariere: careerBreaks,
          procent_skladek: sickLeaveDays,
          wskaznik_waloryzacji: valorization / 100 + 1,
          wskaznik_inflacji: inflation / 100,
        };

        console.log("Wysyłam zapytanie do API:", requestBody);

        // Use proxy in development, direct URL in production
        const apiUrl = import.meta.env.DEV
          ? "/api/prognoza-wykres" // Proxy
          : "https://xvv7kcpl-8000.euw.devtunnels.ms/prognoza-wykres"; // Direct

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          console.log("Odpowiedź API status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Dane z API:", data);
            setApiPensionNominal(data.przyszla_emerytura_nominalna);
            setApiPensionReal(data.przyszla_emerytura_realna);
          } else {
            console.error("API zwróciło błąd:", response.status);
          }
        } catch (error) {
          console.error("Błąd podczas wywoływania API:", error);
        }
      };

      fetchCalculatedPension();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    age,
    gender,
    retirementAge,
    monthlyIncome,
    careerBreaks,
    sickLeaveDays,
    valorization,
    inflation,
  ]);

  return (
    <>
      <Header
        showDownloadButton={true}
        showBackButton={true}
        onDownloadPDF={handleDownloadPDF}
      />
      <div className="bg-gray-50 min-h-screen" ref={contentRef}>
        <div>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-[hsl(var(--green-primary))] to-[hsl(var(--blue-primary))] py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-white text-4xl font-bold mb-8">
                Twoja przyszłość prezentuje się tak...
              </h1>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-[hsl(var(--blue-primary))]" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-lg">
                        Twój profil
                      </h3>
                      <p className="text-gray-500 text-sm">{age} Lat</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Aktualna wypłata
                      </span>
                      <span className="text-[hsl(var(--blue-primary))] font-bold">
                        {actualSalary.toLocaleString("pl-PL")} PLN
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Lata do emerytury
                      </span>
                      <span className="text-[hsl(var(--blue-primary))] font-bold">
                        {yearsToRetirement} lat
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Przyszła emerytura
                      </span>
                      <span className="text-[hsl(var(--blue-primary))] font-bold text-lg">
                        {Math.round(futurePensionReal).toLocaleString("pl-PL")}{" "}
                        PLN/month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weather Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="bg-[hsl(var(--blue-primary))] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      Mając {retirementAge} lat
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl mb-3">
                      Pogoda Emerytury
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <WeatherIcon
                        className={`w-12 h-12 ${weatherInfo.color}`}
                      />
                      <span className="text-gray-900 font-semibold text-lg">
                        {weatherInfo.text}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {weatherInfo.description}
                    </p>
                  </div>
                </div>

                {/* Quick Comparison Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-gray-900 font-semibold text-lg mb-4">
                    Szybkie porównanie
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">
                          Twoja przyszła emerytura
                        </span>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {Math.round(futurePensionReal).toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[hsl(var(--blue-primary))] h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (futurePensionReal / avgNationalPension) * 60
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">
                          Średnia krajowa
                        </span>
                        <span className="text-gray-900 font-bold">
                          {Math.round(avgNationalPension).toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg mt-4 ${
                        percentDifference >= 0
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className="text-gray-600 text-xs mb-1">
                        Twoja emerytura byłaby
                      </p>
                      <p
                        className={`font-bold text-lg ${
                          percentDifference >= 0
                            ? "text-[hsl(var(--success))]"
                            : "text-destructive"
                        }`}
                      >
                        {percentDifference > 0 ? "+" : ""}
                        {percentDifference.toFixed(0)}%{" "}
                        {percentDifference >= 0
                          ? "wyższa od średniej!"
                          : "niższa od średniej!"}
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
              {/* Conditional Image Display */}
              {ileLat && (
                <div className="text-center mb-12">
                  <img
                    src={
                      new URL("@/assets/ile-lat-image.png", import.meta.url)
                        .href
                    }
                    alt="Ile lat informacja"
                    className="mx-auto mb-4 w-48 h-auto"
                  />
                  <p className="text-gray-700 font-semibold text-lg">
                    {ileLat}
                  </p>
                </div>
              )}

              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <h2 className="text-gray-900 text-3xl font-bold">
                    Scenariusze
                  </h2>
                  <AIRecommendations
                    retirementData={{
                      age,
                      gender,
                      retirementAge,
                      monthlyIncome,
                      careerBreaks,
                      sickLeaveDays,
                      valorization,
                      inflation,
                      actualSalary,
                      yearsToRetirement,
                      futurePensionReal,
                      futurePensionNominal,
                      avgNationalPension,
                      percentDifference,
                      apiPensionNominal,
                      apiPensionReal,
                      weatherStatus: weatherInfo.text,
                      weatherDescription: weatherInfo.description,
                    }}
                  />
                </div>
                <p className="text-gray-600">
                  Baw się różnymi scenariuszami i zobacz, jak wpłyną one na
                  Twoją przyszłość
                </p>
              </div>

              <h3 className="text-[hsl(var(--blue-primary))] text-xl font-semibold mb-6">
                Wpływ wyborów życiowych
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Scenario 1 - Career Break */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Plane className="w-5 h-5 text-[hsl(var(--blue-primary))]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold text-base mb-1">
                        Chcesz sobie zrobić dwa lata przerwy?
                      </h4>
                      <p className="text-gray-500 text-xs">W wieku 30 lat</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Pension Impact</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-red-200 h-1.5 rounded-full"></div>
                      <span className="text-red-600 font-semibold text-sm whitespace-nowrap">
                        -6% / -294 PLN
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Emerytura</p>
                      <p className="text-[hsl(var(--blue-primary))] font-bold text-lg">
                        4,596 PLN
                      </p>
                    </div>
                    <button className="bg-[hsl(var(--blue-primary))] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                      Wyróbuj
                    </button>
                  </div>
                </div>

                {/* Scenario 2 - Better Job */}
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Briefcase className="w-5 h-5 text-[hsl(var(--success))]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold text-base mb-1">
                        Zmiana na lepiej płatną pracę?
                      </h4>
                      <p className="text-gray-500 text-xs">
                        +15% wzrost wypłaty
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Wzrost emerytury
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-green-200 h-1.5 rounded-full"></div>
                      <span className="text-[hsl(var(--success))] font-semibold text-sm whitespace-nowrap">
                        +7% / +342 PLN
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Emerytura</p>
                      <p className="text-[hsl(var(--blue-primary))] font-bold text-lg">
                        5,232 PLN
                      </p>
                    </div>
                    <button className="bg-[hsl(var(--success))] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                      Akceptuj
                    </button>
                  </div>
                </div>

                {/* Scenario 3 - Work Longer */}
                <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Umbrella className="w-5 h-5 text-[hsl(var(--warning))]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-semibold text-base mb-1">
                        Pracuj dwa lata dłużej?
                      </h4>
                      <p className="text-gray-500 text-xs">
                        Przejdź na emeryturę w wieku 69 lat, a nie 67
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Miesięczny wzrost
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-orange-200 h-1.5 rounded-full"></div>
                      <span className="text-[hsl(var(--warning))] font-semibold text-sm whitespace-nowrap">
                        +420 PLN
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Emerytura</p>
                      <p className="text-[hsl(var(--blue-primary))] font-bold text-lg">
                        5,310 PLN
                      </p>
                    </div>
                    <button className="bg-[hsl(var(--warning))] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                      Rozważ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-gray-900 text-3xl font-bold mb-3">
                  Kalkulator Emerytury
                </h2>
                <p className="text-gray-600">
                  Sprawdź ile realnie czcza jak twoja emerytura może urosną
                  <br />
                  Wykrze zmieniaj się na bieżąco
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Sliders */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-[hsl(var(--blue-primary))] text-lg font-semibold mb-6">
                    Sterowanie symulacją na żywo
                  </h3>

                  <div className="space-y-6">
                    {/* Age */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Wiek
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {age} lat
                        </span>
                      </div>
                      <Slider
                        value={[age]}
                        onValueChange={(val) => setAge(val[0])}
                        min={18}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="text-gray-700 text-sm font-medium mb-3 block">
                        Płeć
                      </label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setGender("female")}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                            gender === "female"
                              ? "bg-[hsl(var(--success))] text-white border-[hsl(var(--success))]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-[hsl(var(--success))]"
                          }`}
                        >
                          Kobieta
                        </button>
                        <button
                          onClick={() => setGender("male")}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                            gender === "male"
                              ? "bg-gray-600 text-white border-gray-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-600"
                          }`}
                        >
                          Mężczyzna
                        </button>
                      </div>
                    </div>

                    {/* Retirement Age */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Wiek przejścia na emeryturę
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {retirementAge} lat
                        </span>
                      </div>
                      <Slider
                        value={[retirementAge]}
                        onValueChange={(val) => setRetirementAge(val[0])}
                        min={60}
                        max={70}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Monthly Income */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Miesięczny przychód
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {monthlyIncome.toLocaleString()} PLN
                        </span>
                      </div>
                      <Slider
                        value={[monthlyIncome]}
                        onValueChange={(val) => setMonthlyIncome(val[0])}
                        min={4000}
                        max={15000}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    {/* Career Breaks */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Przerwy w karierze (lata)
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {careerBreaks} lat
                        </span>
                      </div>
                      <Slider
                        value={[careerBreaks]}
                        onValueChange={(val) => setCareerBreaks(val[0])}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Sick Leave Days */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Procent składek [Obowiązuje aktualnie 19%]
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {sickLeaveDays} %
                        </span>
                      </div>
                      <Slider
                        value={[sickLeaveDays]}
                        onValueChange={(val) => setSickLeaveDays(val[0])}
                        min={1}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Valorization */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Wskaźnik waloryzacji
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {valorization} %
                        </span>
                      </div>
                      <Slider
                        value={[valorization]}
                        onValueChange={(val) => setValorization(val[0])}
                        min={0.1}
                        max={20}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* Inflation */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-700 text-sm font-medium">
                          Wskaźnik inflacji
                        </label>
                        <span className="text-[hsl(var(--blue-primary))] font-bold">
                          {inflation} %
                        </span>
                      </div>
                      <Slider
                        value={[inflation]}
                        onValueChange={(val) => setInflation(val[0])}
                        min={-15}
                        max={15}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button
                        onClick={handleCalculate}
                        className="bg-[hsl(var(--blue-primary))] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Oblicz
                      </button>
                      <button
                        onClick={handleReset}
                        className="bg-white border-2 border-[hsl(var(--warning))] text-[hsl(var(--warning))] py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Charts */}
                <div className="flex flex-col gap-6">
                  {/* Projected Pension */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <p className="text-gray-600 text-sm mb-2">
                      Przewidywana emerytura
                    </p>
                    <p className="text-[hsl(var(--blue-primary))] text-4xl font-bold">
                      {Math.round(futurePensionReal).toLocaleString("pl-PL")}{" "}
                      PLN
                    </p>
                  </div>

                  {/* Calculated Pension from API */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                    <p className="text-gray-600 text-sm mb-2">
                      Emerytura obliczona
                    </p>
                    <p className="text-[hsl(var(--blue-primary))] text-4xl font-bold">
                      {apiPensionNominal
                        ? Math.round(apiPensionNominal).toLocaleString("pl-PL")
                        : "---"}{" "}
                      PLN
                    </p>
                  </div>

                  {/* Bar Charts Comparison */}
                  <div className="bg-white rounded-xl p-6 shadow-lg overflow-visible flex-1 flex flex-col justify-end">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 align-bottom">
                      {/* Projected Chart */}
                      <div className="text-center">
                        <div
                          className="relative flex flex-col justify-end"
                          style={{ height: "256px", maxHeight: "256px" }}
                        >
                          {/* Bars */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
                            <div
                              className="relative bg-[#00993F] rounded-t-lg"
                              style={{
                                height: `${projectedBarHeightNominal}px`,
                              }}
                            >
                              <div className="absolute top-2 -right-20 sm:-right-24 flex items-center gap-1 sm:gap-2 min-w-max">
                                <div className="w-6 sm:w-8 h-0.5 bg-[#00993F]"></div>
                                <span className="text-[#00993F] font-bold text-[10px] sm:text-xs whitespace-nowrap">
                                  {Math.round(
                                    futurePensionNominal
                                  ).toLocaleString()}{" "}
                                  PLN
                                </span>
                              </div>
                            </div>
                            <div
                              className="relative bg-red-400 rounded-b-lg"
                              style={{
                                height: `${projectedBarHeightReal}px`,
                              }}
                            >
                              <div className="absolute top-2 -right-20 sm:-right-24 flex items-center gap-1 sm:gap-2 min-w-max">
                                <div className="w-6 sm:w-8 h-0.5 bg-red-400"></div>
                                <span className="text-red-400 font-bold text-[10px] sm:text-xs whitespace-nowrap">
                                  {Math.round(
                                    futurePensionReal
                                  ).toLocaleString()}{" "}
                                  PLN
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-900 font-semibold mt-4">
                          Wykres poglądowy
                        </p>
                      </div>

                      {/* Calculated Chart */}
                      <div className="text-center">
                        <div
                          className="relative flex flex-col justify-end"
                          style={{ height: "256px", maxHeight: "256px" }}
                        >
                          {/* Bars */}
                          {apiPensionNominal && apiPensionReal ? (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
                              <div
                                className="relative bg-[#00993F] rounded-t-lg"
                                style={{
                                  height: `${calculatedBarHeightNominal}px`,
                                }}
                              >
                                <div className="absolute top-2 -right-20 sm:-right-24 flex items-center gap-1 sm:gap-2 min-w-max">
                                  <div className="w-6 sm:w-8 h-0.5 bg-[#00993F]"></div>
                                  <span className="text-[#00993F] font-bold text-[10px] sm:text-xs whitespace-nowrap">
                                    {Math.round(
                                      apiPensionNominal
                                    ).toLocaleString()}{" "}
                                    PLN
                                  </span>
                                </div>
                              </div>
                              <div
                                className="relative bg-red-400 rounded-b-lg"
                                style={{
                                  height: `${calculatedBarHeightReal}px`,
                                }}
                              >
                                <div className="absolute top-2 -right-20 sm:-right-24 flex items-center gap-1 sm:gap-2 min-w-max">
                                  <div className="w-6 sm:w-8 h-0.5 bg-red-400"></div>
                                  <span className="text-red-400 font-bold text-[10px] sm:text-xs whitespace-nowrap">
                                    {Math.round(
                                      apiPensionReal
                                    ).toLocaleString()}{" "}
                                    PLN
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              Ładowanie danych...
                            </div>
                          )}
                        </div>
                        <p className="text-gray-900 font-semibold mt-4">
                          Wykres obliczany
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Did You Know Section */}
          <section className="py-16 px-6 bg-gradient-to-r from-[hsl(var(--green-primary))] to-[hsl(var(--blue-primary))]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-bold mb-3">
                  Wiedziałeś że?
                </h2>
                <p className="text-white/90">
                  Uczysz się, odkrywając swoją przyszłość
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-xl p-6">
                  <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-[hsl(var(--warning))] text-2xl font-bold">
                      ?
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-3">
                    Każdy dodatkowy rok liczy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    Jak nie masz poczekowane pracy każda wycieczka zrobi się
                    więce w wieku 25 sot
                  </p>
                  <p className="text-[hsl(var(--warning))] font-bold text-lg">
                    +8% co rok
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl p-6">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="text-[hsl(var(--success))] w-6 h-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-3">
                    Most Pokoleniowy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    Twoje składki dziś wspierają obecnych emerytów, a przyszłe
                    pokolenia wspomogą Ciebie
                  </p>
                  <p className="text-[hsl(var(--success))] font-bold">
                    Social solidarity
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl p-6">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-red-500 text-2xl font-bold">!</span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-3">
                    Wprócz na emeryturę
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    ZUS oferuje Ci przed emeryturze, której składki i dłuższe
                    płacić jeszcze w wieku 65 lat
                  </p>
                  <p className="text-red-600 font-bold">Full protection</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />

        <DashboardAIChat
          userEmail=""
          retirementData={{
            age,
            gender,
            retirementAge,
            monthlyIncome,
            careerBreaks,
            sickLeaveDays,
            valorization,
            inflation,
            actualSalary,
            yearsToRetirement,
            futurePensionReal,
            futurePensionNominal,
            avgNationalPension,
            percentDifference,
            apiPensionNominal,
            apiPensionReal,
            weatherStatus: weatherInfo.text,
            weatherDescription: weatherInfo.description,
          }}
        />
      </div>
    </>
  );
};

export default Results;
