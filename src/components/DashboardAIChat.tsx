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

const EXAMPLE_QUESTIONS = [
  "Jak wygląda moja przyszła emerytura?",
  "Co mogę zrobić, żeby zwiększyć emeryturę?",
  "Jak przerwy w karierze wpływają na emeryturę?",
  "Czy powinienem pracować dłużej?",
  "Jak moja emerytura wypada na tle średniej?",
];

const formatMessage = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
};

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

  const handleExampleQuestion = (question: string) => {
    setInput(question);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg animate-scale-in hover:scale-110 transition-transform"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl flex flex-col animate-scale-in border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg">Asystent AI 🤖</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Cześć! Zapytaj mnie o swoją emeryturę 👋
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground px-2">Przykładowe pytania:</p>
                {EXAMPLE_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleQuestion(question)}
                    className="w-full text-left text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors border border-border/50 hover:border-primary/50 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted border border-border/50'
                }`}
              >
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-muted rounded-lg px-4 py-3 border border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 border-t pt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napisz wiadomość..."
            className="resize-none min-h-[60px] text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-[60px] hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
