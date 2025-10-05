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

ZASADY ODPOWIEDZI:
- Odpowiadaj KRÓTKO i ZWIĘŹLE (max 3-4 zdania)
- Używaj formatowania markdown: **pogrubienie** dla liczb i ważnych informacji
- Dziel dłuższe odpowiedzi na punkty lub krótkie akapity
- Skupiaj się na konkretach, unikaj długich wyjaśnień
- Używaj emoji dla lepszej czytelności (💰 📊 📈 ⚠️ ✅)

${dashboardContext.retirementData ? `
DANE UŻYTKOWNIKA:
- Wiek: ${dashboardContext.retirementData.wiek} lat
- Płeć: ${dashboardContext.retirementData.plec}
- Wiek emerytury: ${dashboardContext.retirementData.wiek_przejscia_na_emeryture} lat
- Miesięczny dochód: ${dashboardContext.retirementData.miesieczny_dochod} PLN
- Lata do emerytury: ${dashboardContext.retirementData.lata_do_emerytury} lat

PROGNOZA:
- Przyszła emerytura: ${Math.round(dashboardContext.retirementData.przyszla_emerytura_realna)} PLN/mies.
- Średnia krajowa: ${Math.round(dashboardContext.retirementData.srednia_krajowa_emerytura)} PLN/mies.
- Różnica: ${dashboardContext.retirementData.roznica_procent.toFixed(1)}%
- Status: ${dashboardContext.retirementData.status_pogody}
` : 'Użytkownik nie ma jeszcze danych o emeryturze.'}

Odpowiadaj zawsze po polsku, krótko i konkretnie.`;

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
