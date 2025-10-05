// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Proxy w trybie deweloperskim
  : 'https://xvv7kcpl-8000.euw.devtunnels.ms';  // Bezpośredni URL w produkcji

export interface PrognosiRequest {
  plec: 'kobieta' | 'mezczyzna';
  wiek: number;
  miesieczny_przychod: number;
  rok_rozpoczecia_kariery: number;
  rok_przejscia_na_emeryture: number;
  saldo_zus?: number;
  saldo_ofe?: number;
  kod_pocztowy?: string;
  ilosc_dni_zwolnien?: number;
}

export interface PrognosiResponse {
  aktualna_wyplata: number;
  lata_do_emerytury: number;
  przyszla_emerytura_nominalna: number;
  przyszla_emerytura_realna: number;
  srednia_krajowa_emerytura: number;
  roznica_procent: number;
  szczegoly: {
    podstawa_obliczenia_emerytury: number;
    srednie_dalsze_trwanie_zycia_miesiace: number;
    szacowana_suma_skladek: number;
    kapital_poczatkowy: number;
    wspolczynnik_waloryzacji: number;
    wspolczynnik_inflacji: number;
    lata_skladkowe: number;
    srednia_skladka_miesieczna: number;
  };
  ciekawostki: string[];
}

export const fetchPrognosis = async (data: PrognosiRequest): Promise<PrognosiResponse> => {
  const response = await fetch(`${API_BASE_URL}/prognoza`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
