import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DashboardAIChatProps {
  userEmail: string;
  retirementData?: {
    age: number;
    gender: string;
    retirementAge: number;
    monthlyIncome: number;
    careerBreaks: number;
    sickLeaveDays: number;
    valorization: number;
    inflation: number;
    actualSalary: number;
    yearsToRetirement: number;
    futurePensionReal: number;
    futurePensionNominal: number;
    avgNationalPension: number;
    percentDifference: number;
    apiPensionNominal: number | null;
    apiPensionReal: number | null;
    weatherStatus: string;
    weatherDescription: string;
  };
}

export const DashboardAIChat = ({ userEmail, retirementData }: DashboardAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    console.log('Sending message to AI:', userMessage);
    console.log('Retirement data:', retirementData);

    try {
      const dashboardContext = {
        userEmail,
        retirementData: retirementData ? {
          wiek: retirementData.age,
          plec: retirementData.gender === 'female' ? 'kobieta' : 'mężczyzna',
          wiek_przejscia_na_emeryture: retirementData.retirementAge,
          miesieczny_dochod: retirementData.monthlyIncome,
          przerwy_w_karierze: retirementData.careerBreaks,
          dni_zwolnien: retirementData.sickLeaveDays,
          waloryzacja: retirementData.valorization,
          inflacja: retirementData.inflation,
          aktualna_wyplata: retirementData.actualSalary,
          lata_do_emerytury: retirementData.yearsToRetirement,
          przyszla_emerytura_realna: retirementData.futurePensionReal,
          przyszla_emerytura_nominalna: retirementData.futurePensionNominal,
          srednia_krajowa_emerytura: retirementData.avgNationalPension,
          roznica_procent: retirementData.percentDifference,
          emerytura_z_kalkulatora_nominalna: retirementData.apiPensionNominal,
          emerytura_z_kalkulatora_realna: retirementData.apiPensionReal,
          status_pogody: retirementData.weatherStatus,
          opis_pogody: retirementData.weatherDescription,
        } : null,
        timestamp: new Date().toISOString(),
      };

      console.log('Dashboard context:', dashboardContext);
      console.log('Calling edge function...');

      const { data, error } = await supabase.functions.invoke('dashboard-ai-chat', {
        body: {
          message: userMessage,
          dashboardContext
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Asystent AI</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p>Cześć! Jestem twoim asystentem AI.</p>
              <p className="text-sm mt-2">Zadaj mi pytanie o swoje dane lub konto.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napisz wiadomość..."
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
