"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Server, Database, ShieldCheck, Code2, Cpu, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  lang: "pt" | "en";
};

export default function ArchitectureModal({ isOpen, onClose, product, lang }: ModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveTab(0);
    }
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!product || !product.deepTech) return null;

  const content = product.deepTech[lang];
  const activeItem = content[activeTab] || content[0];

  // Helper para renderizar o ícone correto
  const renderIcon = (IconComponent: any) => {
    if (!IconComponent) return <Cpu size={18} />;
    return <IconComponent size={18} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 100, 
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            key="modal-content"
            onClick={(e) => e.stopPropagation()} // Previne que o click feche o modal
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              width: '100%', maxWidth: '950px', height: '90vh', maxHeight: '800px',
              background: 'linear-gradient(135deg, rgba(20,25,35,0.95) 0%, rgba(7,10,18,0.98) 100%)', 
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)', // Luz direcional de cima
              borderRadius: '24px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 30px 60px rgba(0,0,0,0.8), 0 0 120px rgba(45,212,191,0.15)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              position: 'relative'
            }}
          >
          {/* Geometria de Fundo (Grid Texture) */}
          <div style={{
             position: 'absolute', inset: 0, pointerEvents: 'none',
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
             backgroundSize: '40px 40px', zIndex: 0,
             maskImage: 'radial-gradient(ellipse at 50% 0%, black, transparent 70%)',
             WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black, transparent 70%)'
          }} />

          {/* Animated Glowing Orbs for Volume/Depth */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '-15%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)' }} 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], x: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(60px)' }} 
          />
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px 24px', background: 'transparent', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {(product.logoHorizontal || product.icon) && (
                <div style={{ 
                  background: (product.name.includes("SelectSys") || product.name.includes("mercadinhosys")) ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,245,255,0.9))' : 'linear-gradient(135deg, rgba(30,40,55,0.5), rgba(15,20,30,0.8))', 
                  padding: (product.name.includes("SelectSys") || product.name.includes("mercadinhosys")) ? '10px 24px' : '12px 20px', 
                  borderRadius: '24px', 
                  boxShadow: (product.name.includes("SelectSys") || product.name.includes("mercadinhosys")) 
                    ? 'inset 0 2px 4px rgba(255,255,255,1), 0 10px 30px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.1)' 
                    : 'inset 0 2px 2px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(45,212,191,0.2)',
                  border: (product.name.includes("SelectSys") || product.name.includes("mercadinhosys")) ? '1px solid rgba(255,255,255,1)' : '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={`${product.logoHorizontal || product.icon}?v=6`} alt={product.name} style={{ height: '52px', width: 'auto', objectFit: 'contain', filter: (product.name.includes("SelectSys") || product.name.includes("mercadinhosys")) ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' : 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }} />
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>{product.name}</h3>
                <p style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '14px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {lang === 'pt' ? 'Documentação Arquitetural' : 'Architectural Documentation'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Body com Sidebar */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', zIndex: 10 }}>
              {/* Sidebar de Abas */}
              <div style={{ width: '280px', background: 'rgba(0,0,0,0.3)', boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                  {content.map((item: any, idx: number) => {
                      const isActive = activeTab === idx;
                      return (
                      <button
                          key={item.id}
                          onClick={() => setActiveTab(idx)}
                          style={{
                              position: 'relative',
                              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', textAlign: 'left', transition: 'color 0.3s', border: 'none', cursor: 'pointer',
                              background: 'transparent',
                              color: isActive ? '#fff' : '#94a3b8',
                              zIndex: 1
                          }}
                      >
                          {/* Magic Highlight Indicator (Framer Motion) */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              initial={false}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(45, 212, 191, 0.15)',
                                borderRadius: '12px', zIndex: -1,
                                border: '1px solid rgba(45, 212, 191, 0.4)',
                                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.15), 0 8px 24px rgba(45, 212, 191, 0.25)'
                              }}
                            />
                          )}
                          <span style={{ opacity: isActive ? 1 : 0.5, display: 'flex', color: isActive ? 'var(--accent)' : 'inherit', transition: 'all 0.3s' }}>
                              {renderIcon(item.icon)}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.2, flex: 1, letterSpacing: '-0.2px' }}>
                              {item.title}
                          </span>
                      </button>
                      );
                  })}
              </div>

              {/* Conteúdo da Aba Ativa */}
              <div style={{ flex: 1, padding: '48px', overflowY: 'auto', position: 'relative' }}>
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -15, scale: 0.98, filter: 'blur(10px)' }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                              <div style={{ padding: '12px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '12px', border: '1px solid rgba(45, 212, 191, 0.2)', color: 'var(--accent)', display: 'flex' }}>
                                  {renderIcon(activeItem.icon)}
                              </div>
                              <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: 0 }}>{activeItem.title}</h4>
                          </div>
                          
                          <div style={{ color: '#cbd5e1', fontSize: '18px', lineHeight: 1.7 }}>
                            {activeItem.desc}
                          </div>
                      </motion.div>
                  </AnimatePresence>
              </div>
          </div>
          
          {/* Footer Stack Grid */}
          <div style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.2)', display: 'flex', gap: '12px', overflowX: 'auto', alignItems: 'center', zIndex: 10 }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginRight: '8px', fontFamily: 'var(--mono)' }}>Tech Stack:</span>
              {product.tags.map((tag: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap', fontSize: '12px', color: '#cbd5e1' }}>
                      {tag.s && <img src={tag.s} alt="" style={{ width: '14px', height: '14px', opacity: 0.8 }} />}
                      {tag.l}
                  </div>
              ))}
          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
