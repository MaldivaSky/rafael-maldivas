"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Spotlight } from "../components/fx";

const QUESTIONS = [
  { id: "site", text: "Seu site carrega rápido e funciona bem no celular?", category: "Tecnologia" },
  { id: "seo", text: "Sua empresa aparece na 1ª página do Google para seus serviços?", category: "Atração" },
  { id: "social", text: "As redes sociais geram tráfego real para o site/WhatsApp?", category: "Atração" },
  { id: "conversion", text: "É fácil para o cliente pedir um orçamento ou comprar online?", category: "Conversão" },
  { id: "automation", text: "Você usa alguma automação para responder leads fora do horário?", category: "Conversão" },
  { id: "metrics", text: "Você sabe exatamente qual canal traz mais clientes rentáveis?", category: "Dados" },
];

export default function DiagnosticoTool() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (val: number) => {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let total = 0;
    const catScores: Record<string, { sum: number; count: number }> = {};
    
    Object.keys(answers).forEach((key) => {
      const q = QUESTIONS.find((q) => q.id === key);
      if (q) {
        const val = answers[key];
        total += val;
        if (!catScores[q.category]) catScores[q.category] = { sum: 0, count: 0 };
        catScores[q.category].sum += val;
        catScores[q.category].count += 1;
      }
    });

    const data = Object.keys(catScores).map((cat) => ({
      subject: cat,
      A: Math.round((catScores[cat].sum / (catScores[cat].count * 10)) * 100),
      fullMark: 100,
    }));

    const finalScore = Math.round((total / (QUESTIONS.length * 10)) * 100);
    return { data, finalScore };
  };

  if (showResult) {
    const { data, finalScore } = calculateScore();
    
    return (
      <Spotlight className="tool-box" style={{ padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-dim)", marginBottom: "16px" }}>Seu Score de Maturidade</div>
          <div style={{ fontSize: "72px", fontWeight: 900, color: finalScore > 70 ? "var(--accent)" : finalScore > 40 ? "#f59e0b" : "#ef4444", lineHeight: 1 }}>
            {finalScore}
          </div>
          <p style={{ marginTop: "16px", color: "var(--fg-muted)", fontSize: "16px" }}>
            {finalScore > 70 
              ? "Sua máquina de vendas digitais está bem estruturada. O foco agora é escala e otimização avançada."
              : finalScore > 40
              ? "Você tem uma base, mas está deixando muito dinheiro na mesa por falta de processos e conversão."
              : "Sua presença digital é um gargalo para o negócio. Há oportunidades gigantes de melhoria imediata."}
          </p>
        </div>

        <div style={{ width: "100%", height: "300px", marginBottom: "32px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--line-strong)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--fg-dim)", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/5511919889233?text=Oi%20Rafael!%20Fiz%20o%20Diagnostico%20Digital%20e%20tirei%20score%20" className="btn btn-primary" style={{ padding: "12px 24px" }}>
            Analisar meu caso no WhatsApp <ArrowRight size={18} />
          </a>
          <button onClick={() => { setStep(0); setAnswers({}); setShowResult(false); }} className="btn btn-ghost">
            <RotateCcw size={18} /> Refazer teste
          </button>
        </div>
      </Spotlight>
    );
  }

  return (
    <Spotlight className="tool-box" style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", marginBottom: "8px" }}>
          Passo {step + 1} de {QUESTIONS.length}
        </div>
        <div style={{ height: "4px", background: "var(--line)", borderRadius: "2px", width: "100%", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--accent)", width: `${((step) / QUESTIONS.length) * 100}%`, transition: "width 0.3s ease" }} />
        </div>
      </div>

      <h3 style={{ fontSize: "24px", marginBottom: "8px" }}>{QUESTIONS[step].category}</h3>
      <p style={{ fontSize: "20px", color: "var(--fg-muted)", marginBottom: "40px", lineHeight: 1.5 }}>
        {QUESTIONS[step].text}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button onClick={() => handleAnswer(10)} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "16px", border: "1px solid var(--line)", borderRadius: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
          </div>
          Sim, com certeza (10)
        </button>
        <button onClick={() => handleAnswer(5)} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "16px", border: "1px solid var(--line)", borderRadius: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }} />
          </div>
          Parcialmente / Às vezes (5)
        </button>
        <button onClick={() => handleAnswer(0)} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "16px", border: "1px solid var(--line)", borderRadius: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
          </div>
          Não, preciso melhorar (0)
        </button>
      </div>
    </Spotlight>
  );
}
