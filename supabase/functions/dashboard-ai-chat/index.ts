import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, dashboardContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request:", { message, dashboardContext });

    const systemPrompt = `Jesteś pomocnym asystentem AI w polskim panelu administracyjnym aplikacji emerytalnej. 
Pomagasz użytkownikom zrozumieć ich dane emerytalne i odpowiadasz na pytania związane z ich prognozą emerytury.

${dashboardContext.retirementData ? `
DANE UŻYTKOWNIKA:
- Wiek: ${dashboardContext.retirementData.wiek} lat
- Płeć: ${dashboardContext.retirementData.plec}
- Wiek przejścia na emeryturę: ${dashboardContext.retirementData.wiek_przejscia_na_emeryture} lat
- Miesięczny dochód: ${dashboardContext.retirementData.miesieczny_dochod} PLN
- Przerwy w karierze: ${dashboardContext.retirementData.przerwy_w_karierze} miesięcy
- Dni zwolnień: ${dashboardContext.retirementData.dni_zwolnien} dni
- Waloryzacja: ${dashboardContext.retirementData.waloryzacja}%
- Inflacja: ${dashboardContext.retirementData.inflacja}%

PROGNOZA EMERYTURY:
- Aktualna wypłata: ${dashboardContext.retirementData.aktualna_wyplata} PLN
- Lata do emerytury: ${dashboardContext.retirementData.lata_do_emerytury} lat
- Przyszła emerytura (realna): ${Math.round(dashboardContext.retirementData.przyszla_emerytura_realna)} PLN/miesiąc
- Przyszła emerytura (nominalna): ${Math.round(dashboardContext.retirementData.przyszla_emerytura_nominalna)} PLN/miesiąc
- Średnia krajowa emerytura: ${Math.round(dashboardContext.retirementData.srednia_krajowa_emerytura)} PLN/miesiąc
- Różnica do średniej: ${dashboardContext.retirementData.roznica_procent.toFixed(1)}%
- Status pogody emerytury: ${dashboardContext.retirementData.status_pogody}
- ${dashboardContext.retirementData.opis_pogody}

${dashboardContext.retirementData.emerytura_z_kalkulatora_nominalna ? `
DANE Z KALKULATORA:
- Prognoza nominalna: ${Math.round(dashboardContext.retirementData.emerytura_z_kalkulatora_nominalna)} PLN
- Prognoza realna: ${Math.round(dashboardContext.retirementData.emerytura_z_kalkulatora_realna || 0)} PLN
` : ''}
` : 'Użytkownik nie ma jeszcze danych o emeryturze.'}

Zawsze odpowiadaj po polsku. Bądź pomocny, jasny i konkretny. 
Pomagaj użytkownikowi zrozumieć jego sytuację emerytalną i udzielaj praktycznych porad.
Jeśli nie masz informacji potrzebnych do odpowiedzi, powiedz o tym użytkownikowi.
Używaj danych z kontekstu do odpowiedzi na pytania użytkownika.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Przekroczono limit zapytań. Spróbuj ponownie za chwilę." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Wymagana płatność. Dodaj środki do swojego konta Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log("AI response received:", aiResponse?.substring(0, 100));

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in dashboard-ai-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
