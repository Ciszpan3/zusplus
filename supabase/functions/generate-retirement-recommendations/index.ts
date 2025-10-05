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
    const { retirementData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating retirement recommendations for user");

    const systemPrompt = `Jesteś ekspertem ds. emerytur i planowania finansowego. Analizujesz dane emerytalne użytkownika i generujesz 3-5 KONKRETNYCH, POLICJALNYCH rekomendacji.

DANE UŻYTKOWNIKA:
- Wiek: ${retirementData.wiek} lat
- Płeć: ${retirementData.plec}
- Wiek emerytury: ${retirementData.wiek_przejscia_na_emeryture} lat
- Miesięczny dochód: ${retirementData.miesieczny_dochod} PLN
- Lata do emerytury: ${retirementData.lata_do_emerytury} lat
- Przyszła emerytura: ${Math.round(retirementData.przyszla_emerytura_realna)} PLN/mies.
- Średnia krajowa: ${Math.round(retirementData.srednia_krajowa_emerytura)} PLN/mies.
- Różnica vs średnia: ${retirementData.roznica_procent.toFixed(1)}%
- Status: ${retirementData.status_pogody}

ZASADY:
1. Generuj TYLKO rekomendacje, które FAKTYCZNIE mogą poprawić sytuację użytkownika
2. Każda rekomendacja MUSI zawierać:
   - Konkretną akcję (np. "Wydłuż pracę o 2 lata")
   - Oszacowany wpływ (np. "+300 zł/mies" lub "+8%")
   - Ikona emoji na początku
3. Sortuj od największego do najmniejszego wpływu
4. Jeśli sytuacja jest bardzo dobra (znacznie powyżej średniej), zaproponuj optymalizacje podatkowe lub inwestycyjne
5. Jeśli sytuacja jest słaba, skup się na praktycznych działaniach: PPK, IKE, IKZE, wydłużenie pracy
6. MAX 5 rekomendacji, każda w osobnej linii
7. Format: "🎯 [Akcja] – [Wpływ]"

NIE używaj numeracji, tylko emoji i myślniki.`;

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
          { role: "user", content: "Wygeneruj rekomendacje dla tego użytkownika." }
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
    const recommendations = data.choices?.[0]?.message?.content;

    console.log("Recommendations generated successfully");

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-retirement-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
