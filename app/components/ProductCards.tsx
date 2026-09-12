"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ExternalLink, Server, Sparkles } from "lucide-react";
import { products, type Product } from "../lib/projects";
import { useLang } from "../lib/i18n";
import { t } from "../lib/content";
import { rich } from "../lib/rich";
import { Spotlight, TechIcon } from "./fx";

const ArchitectureModal = dynamic(() => import("./ArchitectureModal"), { ssr: false });
const CardGraphics = dynamic(() => import("./CardGraphics"), { ssr: false });

export default function ProductCards() {
  const { lang } = useLang();
  const c = t[lang];
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="products">
        {products.map((p, i) => {
          const Icon = p.icon;
          const effect = p.name.includes("SelectSys")
            ? "nodes"
            : p.name.includes("mercadinho")
              ? "stream"
              : "pulse";

          return (
            <motion.article
              className="product glass-card"
              style={{ position: "relative", overflow: "hidden" }}
              key={p.name}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardGraphics type={effect as "nodes" | "stream" | "pulse"} />

              <div className="p-top" style={{ position: "relative", zIndex: 10 }}>
                <span className="p-icon" aria-hidden="true">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt=""
                      width={76}
                      height={76}
                      style={{
                        width: 76,
                        height: 76,
                        objectFit: "contain",
                        borderRadius: 14,
                        background: "var(--bg-soft)",
                        padding: 6,
                        border: "1px solid var(--line)",
                      }}
                    />
                  ) : (
                    <Icon className="lucide-accent" size={32} />
                  )}
                </span>
                <div>
                  <h3 className="p-title">{p.name}</h3>
                  <div className="p-role">{p.role[lang]}</div>
                </div>
                <span className={`p-status ${p.status === "live" ? "st-live" : "st-deploy"}`}>
                  {p.statusLabel[lang]}
                </span>
              </div>

              <p className="p-desc" style={{ position: "relative", zIndex: 10 }}>
                {p.desc[lang]}
              </p>

              <div className="p-grid" style={{ position: "relative", zIndex: 10 }}>
                <div className="p-block glass-inner">
                  <h4>{c.lblProblem}</h4>
                  <p>{rich(p.problem[lang])}</p>
                </div>
                <div className="p-block glass-inner">
                  <h4>{c.lblSolution}</h4>
                  <p>{rich(p.solution[lang])}</p>
                </div>
              </div>

              <div className="tags" style={{ position: "relative", zIndex: 10 }}>
                {p.tags.map((tg) => (
                  <span className="tag" key={tg.l}>
                    <TechIcon src={tg.s} size={16} />
                    {tg.l}
                  </span>
                ))}
              </div>

              <div className="p-links" style={{ position: "relative", zIndex: 10 }}>
                {/* contratar vem primeiro: é o botão que fatura */}
                {p.signup && (
                  <a
                    href={p.signup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="plink solid"
                  >
                    <Sparkles size={17} /> {c.lblHire}
                  </a>
                )}
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noopener noreferrer" className="plink">
                    <ExternalLink size={16} /> {c.lblDemo}
                  </a>
                )}
                {p.deepTech && (
                  <button onClick={() => setSelected(p)} className="plink">
                    <Server size={16} />{" "}
                    {lang === "pt" ? "Arquitetura e engenharia" : "Architecture & engineering"}
                  </button>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="plink">
                    {c.lblRepo}
                  </a>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      <ArchitectureModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        product={selected}
        lang={lang}
      />
    </>
  );
}

/* o Spotlight fica disponível para quem quiser embrulhar o card */
export { Spotlight };
