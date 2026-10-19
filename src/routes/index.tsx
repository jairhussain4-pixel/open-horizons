import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  QrCode,
  ArrowLeft,
  Download,
  Share2,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: EternizaApp,
});

interface Scenario {
  id: string;
  title: string;
  video: string;
  poster: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "reencontro",
    title: "A escadaria dourada",
    video: "https://eternizaamor.com/assets/video/estilo-escadaria-nuvens.mp4",
    poster: "https://eternizaamor.com/assets/video/estilo-escadaria-nuvens-poster.webp",
  },
  {
    id: "reencontrocarinho",
    title: "O carinho no céu",
    video: "https://eternizaamor.com/assets/video/estilo-carinho-ceu.mp4",
    poster: "https://eternizaamor.com/assets/video/estilo-carinho-ceu-poster.webp",
  },
  {
    id: "reencontronuvens",
    title: "O abraço nas nuvens",
    video: "https://eternizaamor.com/assets/video/estilo-nuvens.mp4",
    poster: "https://eternizaamor.com/assets/video/estilo-nuvens-poster.webp",
  },
  {
    id: "anjopraia",
    title: "Caminhada na praia",
    video: "https://eternizaamor.com/assets/video/estilo-praia.mp4",
    poster: "https://eternizaamor.com/assets/video/estilo-praia-poster.webp",
  },
];

const PROVAS = [
  "https://eternizaamor.com/assets/img/prova-reencontro-1.webp",
  "https://eternizaamor.com/assets/img/prova-reencontro-2.webp",
  "https://eternizaamor.com/assets/img/prova-reencontro-3.webp",
  "https://eternizaamor.com/assets/img/prova-reencontro-4.webp",
];

function EternizaLogo({ className = "h-11" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 select-none py-1">
      <img
        src="https://eternizaamor.com/assets/img/eterniza-logo.webp"
        alt="Eterniza"
        className={`${className} object-contain`}
        onError={(e) => {
          // Fallback if network blocked
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector(".logo-fallback")) {
            const fallback = document.createElement("div");
            fallback.className = "logo-fallback flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-[#E7C86B]";
            fallback.innerHTML = `<span class="text-3xl">🕊️</span> <span>Eterniza</span>`;
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
}

function EternizaApp() {
  // Navigation: 'scenarios' (21) | 'upload' (1) | 'loading' (3) | 'contact' (5) | 'checkout' (6) | 'delivery' (7)
  const [currentScreen, setCurrentScreen] = useState<
    "scenarios" | "upload" | "loading" | "contact" | "checkout" | "delivery"
  >("scenarios");

  // State
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [fotoVoce, setFotoVoce] = useState<string | null>(null);
  const [fotoPartiu, setFotoPartiu] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Loading progress in Screen 3
  const [bars, setBars] = useState({ p1: 0, p2: 0, p3: 0 });

  // Checkout states
  const [pixRevealed, setPixRevealed] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15:00
  const [activeSlide, setActiveSlide] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Delivery states
  const [deliveringStep, setDeliveringStep] = useState(1);
  const [videoFinalReady, setVideoFinalReady] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pixTargetRef = useRef<HTMLDivElement>(null);

  // Countdown timer for 15 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Scroll to top on screen change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [currentScreen]);

  // Loading Screen simulation logic
  useEffect(() => {
    if (currentScreen !== "loading") return;

    setBars({ p1: 0, p2: 0, p3: 0 });

    const interval = setInterval(() => {
      setBars((prev) => {
        if (prev.p1 < 100) {
          return { ...prev, p1: Math.min(100, prev.p1 + 8) };
        }
        if (prev.p2 < 100) {
          return { ...prev, p2: Math.min(100, prev.p2 + 10) };
        }
        if (prev.p3 < 100) {
          return { ...prev, p3: Math.min(100, prev.p3 + 12) };
        }
        clearInterval(interval);
        setTimeout(() => {
          setCurrentScreen("contact");
        }, 500);
        return prev;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [currentScreen]);

  // Delivery Screen generation animation
  useEffect(() => {
    if (currentScreen !== "delivery") return;

    setDeliveringStep(1);
    setVideoFinalReady(false);

    const step1 = setTimeout(() => setDeliveringStep(2), 1200);
    const step2 = setTimeout(() => setDeliveringStep(3), 2400);
    const step3 = setTimeout(() => setVideoFinalReady(true), 3800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [currentScreen]);

  // Handle Photo upload
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "voce" | "partiu"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === "voce") {
        setFotoVoce(result);
      } else {
        setFotoPartiu(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // WhatsApp mask formatting
  const handleWhatsappChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setWhatsapp(formatted);
  };

  // PIX Code
  const pixCodeString =
    "00020126580014br.gov.bcb.pix013668015cfc-afa7-4867-82c4-72e7e8bc30e7520400005303986540527.905802BR5913ETERNIZA LTDA6009SAO PAULO62070503***6304E8A2";

  const copyPixCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pixCodeString);
    }
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 4000);
  };

  // Listen to scroll in checkout for sticky bottom bar
  const handleCheckoutScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop > 380 && !pixRevealed) {
      setShowStickyBar(true);
    } else {
      setShowStickyBar(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center selection:bg-amber-500/30 font-sans">
      {/* Mobile container - Max 440px like true native app */}
      <div
        ref={scrollRef}
        onScroll={currentScreen === "checkout" ? handleCheckoutScroll : undefined}
        className="w-full max-w-[440px] min-h-screen bg-black flex flex-col relative overflow-x-hidden shadow-2xl border-x border-neutral-900"
      >
        {/* =========================================================================
            SCREEN 21: ESCOLHA DO CENÁRIO (ABERTURA OFICIAL)
           ========================================================================= */}
        {currentScreen === "scenarios" && (
          <div className="flex-1 flex flex-col px-4 pt-3 pb-8 animate-in fade-in duration-300">
            <header className="mb-2">
              <EternizaLogo />
            </header>

            <h1 className="text-xl md:text-2xl font-bold text-center leading-snug tracking-tight text-white mb-1.5">
              Escolha o cenário
            </h1>
            <p className="text-[12.5px] text-white/75 text-center mb-4 font-normal">
              Toque na cena e veja novamente quem fez tanta&nbsp;falta 💛
            </p>

            {/* Grid 2x2 of Scenarios */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenario(item);
                    setCurrentScreen("upload");
                  }}
                  className={`group relative rounded-2xl overflow-hidden aspect-[9/16] bg-neutral-950 border transition-all duration-200 text-left active:scale-[0.98] ${
                    selectedScenario.id === item.id
                      ? "border-[#E7C86B] ring-2 ring-[#E7C86B]/40 shadow-lg shadow-[#E7C86B]/15"
                      : "border-white/15 hover:border-[#E7C86B]/70"
                  }`}
                >
                  <video
                    src={item.video}
                    poster={item.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay & Title */}
                  <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-2.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end">
                    <span className="text-[12px] font-bold text-white leading-tight drop-shadow-md">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#E7C86B] font-medium mt-0.5">
                      Toque para escolher ›
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Links */}
            <footer className="mt-auto pt-4 text-center border-t border-white/10 text-xs text-white/50 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
              <span className="text-white/20">•</span>
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <div className="w-full text-[11px] text-white/40 mt-1">
                Precisa de ajuda?{" "}
                <a
                  href="mailto:contato@eternizaamor.com"
                  className="text-white/70 underline underline-offset-2"
                >
                  contato@eternizaamor.com
                </a>
              </div>
            </footer>
          </div>
        )}

        {/* =========================================================================
            SCREEN 1: UPLOAD DAS 2 FOTOS
           ========================================================================= */}
        {currentScreen === "upload" && (
          <div className="flex-1 flex flex-col px-4 pt-2 pb-6 animate-in fade-in duration-300">
            {/* Top Navigation */}
            <div className="flex items-center justify-between py-1 mb-1">
              <button
                type="button"
                onClick={() => setCurrentScreen("scenarios")}
                className="text-white/60 hover:text-white p-1 -ml-1 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cenários</span>
              </button>
              <EternizaLogo className="h-9" />
              <div className="w-12"></div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-center leading-tight tracking-tight mb-1 text-white">
              Agora dê vida<br />a esse reencontro <span className="inline-block">💛</span>
            </h1>
            <p className="text-[13px] text-white/70 text-center mb-4">
              Envie uma foto sua e uma de quem você quer rever.
            </p>

            {/* Slot labels */}
            <div className="grid grid-cols-2 gap-3 mb-2 text-center">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#E7C86B]">
                VOCÊ
              </span>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#E7C86B]">
                QUEM PARTIU
              </span>
            </div>

            {/* 2 Upload slots */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Slot 1: Você */}
              <label className="relative aspect-[118/160] rounded-2xl border-2 border-dashed border-[#E7C86B]/40 hover:border-[#E7C86B] bg-[#E7C86B]/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, "voce")}
                />
                {fotoVoce ? (
                  <>
                    <img
                      src={fotoVoce}
                      alt="Sua foto"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-2">
                      <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                        TROCAR
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-2 text-center">
                    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl font-light text-[#E8C25A]">
                      +
                    </span>
                    <span className="text-[11px] font-bold tracking-wider text-white">
                      SUA FOTO
                    </span>
                    <span className="text-[10px] text-white/50">Toque p/ enviar</span>
                  </div>
                )}
              </label>

              {/* Slot 2: Quem partiu */}
              <label className="relative aspect-[118/160] rounded-2xl border-2 border-dashed border-[#E7C86B]/40 hover:border-[#E7C86B] bg-[#E7C86B]/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, "partiu")}
                />
                {fotoPartiu ? (
                  <>
                    <img
                      src={fotoPartiu}
                      alt="Foto de quem partiu"
                      className="absolute inset-0 w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-2">
                      <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                        TROCAR
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-2 text-center">
                    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl font-light text-[#E8C25A]">
                      +
                    </span>
                    <span className="text-[11px] font-bold tracking-wider text-white">
                      A FOTO DELE(A)
                    </span>
                    <span className="text-[10px] text-white/50">Toque p/ enviar</span>
                  </div>
                )}
              </label>
            </div>

            {/* Privacy note */}
            <p className="text-[12px] text-white/60 text-center mb-5 flex items-center justify-center gap-1.5">
              <span>🔒</span> Suas fotos são usadas só para criar o seu vídeo.
            </p>

            {/* CTA Button */}
            <button
              type="button"
              disabled={!fotoVoce || !fotoPartiu}
              onClick={() => setCurrentScreen("loading")}
              className={`w-full py-4 rounded-full text-[15.5px] font-extrabold tracking-wide uppercase transition-all duration-300 shadow-xl ${
                fotoVoce && fotoPartiu
                  ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 shadow-amber-500/25 anim-pulse-sub cursor-pointer active:scale-[0.98]"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              CRIAR MEU REENCONTRO
            </button>

            {/* Visual template examples */}
            <div className="mt-7">
              <div className="text-[11px] font-bold text-[#E7C86B] uppercase tracking-wider text-center mb-2.5">
                Exemplos de reencontros criados ✨
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src="https://eternizaamor.com/assets/img/templates-grid-eterniza.webp?v=2"
                  alt="Exemplos de reencontro"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: CARREGANDO / GERANDO PRÉVIA
           ========================================================================= */}
        {currentScreen === "loading" && (
          <div className="flex-1 flex flex-col justify-between px-5 pt-8 pb-10 animate-in fade-in duration-300">
            <div className="text-center">
              <EternizaLogo className="h-8 mb-4" />
              <h1 className="text-xl md:text-2xl font-bold leading-tight mb-2 text-white">
                Preparando o reencontro de vocês…
              </h1>
              <p className="text-sm text-white/70">
                Estamos reconhecendo os dois rostos e criando o abraço
              </p>
            </div>

            {/* Example Video */}
            <div className="my-5 flex flex-col items-center">
              <p className="text-xs text-amber-300/90 font-medium mb-2.5 flex items-center gap-1">
                <span>✨</span> Um exemplo do que estamos criando pra você 💛
              </p>
              <div className="w-[200px] h-[320px] rounded-2xl overflow-hidden border border-amber-300/30 shadow-2xl bg-black">
                <video
                  src="https://eternizaamor.com/assets/video/exemplo-reencontro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3.5 w-full max-w-[340px] mx-auto">
              {/* Bar 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-white/90">
                  <span>Reconhecendo os dois rostos</span>
                  <span className="text-[#E7C86B]">{bars.p1}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#E7C86B] transition-all duration-150 rounded-full"
                    style={{ width: `${bars.p1}%` }}
                  />
                </div>
              </div>

              {/* Bar 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-white/90">
                  <span>Preparando o encontro no céu</span>
                  <span className="text-[#E7C86B]">{bars.p2}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#E7C86B] transition-all duration-150 rounded-full"
                    style={{ width: `${bars.p2}%` }}
                  />
                </div>
              </div>

              {/* Bar 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-white/90">
                  <span>Dando vida ao abraço</span>
                  <span className="text-[#E7C86B]">{bars.p3}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#E7C86B] transition-all duration-150 rounded-full"
                    style={{ width: `${bars.p3}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: CONTATO (EMAIL & WHATSAPP)
           ========================================================================= */}
        {currentScreen === "contact" && (
          <div className="flex-1 flex flex-col justify-between px-5 pt-8 pb-8 animate-in fade-in duration-300">
            <div>
              <EternizaLogo className="h-10 mb-6" />
              <h1 className="text-2xl font-bold text-center leading-snug tracking-tight mb-6 text-white">
                Pra onde enviamos a sua <span className="text-[#F8545D]">cópia</span> do vídeo?
              </h1>

              <div className="space-y-4 max-w-[360px] mx-auto">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 pl-1">
                    Seu e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E7C86B] focus:ring-1 focus:ring-[#E7C86B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 pl-1">
                    Seu WhatsApp com DDD
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => handleWhatsappChange(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E7C86B] focus:ring-1 focus:ring-[#E7C86B]"
                  />
                </div>

                <p className="text-xs text-white/60 text-center leading-relaxed pt-2">
                  Você vê o vídeo aqui na hora e ainda mandamos uma cópia no seu WhatsApp pra guardar pra sempre.{" "}
                  <strong className="text-white/80">Confira se estão corretos.</strong>
                </p>
              </div>
            </div>

            <div className="pt-8 max-w-[360px] w-full mx-auto">
              <button
                type="button"
                disabled={!email || whatsapp.length < 14}
                onClick={() => setCurrentScreen("checkout")}
                className={`w-full py-4 rounded-full text-base font-bold tracking-wide uppercase transition-all duration-200 ${
                  email && whatsapp.length >= 14
                    ? "bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-lg active:scale-[0.98]"
                    : "bg-white/20 text-white/40 cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 6: CHECKOUT & PAGAMENTO PIX
           ========================================================================= */}
        {currentScreen === "checkout" && (
          <div className="flex-1 flex flex-col px-4 pt-2 pb-12 animate-in fade-in duration-300">
            {/* Countdown Badge */}
            <div className="bg-[#42050A] border border-[#820813] text-[#FFD873] text-xs font-bold py-2 px-3 rounded-xl text-center mb-3 flex items-center justify-center gap-1.5 shadow-sm">
              <span>🎁</span>
              <span>
                50% OFF aplicado · expira em <strong>{formatTime(timeLeft)}</strong>
              </span>
            </div>

            {/* Blurred Hero Teaser of Loved One */}
            <div className="relative h-36 rounded-2xl overflow-hidden mb-3 bg-neutral-950 border border-white/10 flex items-center justify-center">
              <img
                src={
                  fotoPartiu ||
                  "https://eternizaamor.com/assets/img/checkout-hero-reencontro.webp"
                }
                alt="Teaser"
                className="w-full h-full object-cover filter blur-[6px] brightness-75 scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-2xl mb-1 shadow-lg">
                  🔒
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#E7C86B]">
                  Prévia Bloqueada
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-3">
              <span className="text-[11px] font-extrabold tracking-widest text-[#E7C86B] uppercase">
                FALTA SÓ O PAGAMENTO
              </span>
              <h1 className="text-lg md:text-xl font-bold leading-tight mt-1 text-white">
                Você está a 1 passo de ver essa lembrança ganhar vida
              </h1>
              <div className="text-xs text-white/80 mt-1.5 flex items-center justify-center gap-1">
                <span>⭐️ 4,9/5</span>
                <span>•</span>
                <b>milhares de famílias emocionadas</b>
              </div>
            </div>

            {/* The Main Checkout Box */}
            <div
              ref={pixTargetRef}
              className="bg-neutral-900/90 border border-white/15 rounded-2xl p-4 mb-4 shadow-xl backdrop-blur-sm"
            >
              {/* Plan Row */}
              <div className="flex items-end justify-between pb-3 border-b border-white/10 mb-3">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    VÍDEO DO REENCONTRO
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/40 line-through">R$ 54,00</span>
                    <span className="text-[10px] font-extrabold text-[#FFC73B] bg-[#FFC73B]/15 border border-[#FFC73B]/40 px-1.5 py-0.2 rounded">
                      50% OFF
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">
                    Taxa de serviço · R$ 0,99
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-[#FFC73B] tracking-tight leading-none">
                    R$ 27,90
                  </div>
                  <div className="text-[10px] text-white/50 font-medium mt-1">
                    pagamento único
                  </div>
                </div>
              </div>

              {!pixRevealed ? (
                /* Pre-click PIX call to action */
                <div>
                  <div className="text-xs text-white/70 text-center mb-2.5 flex items-center justify-center gap-1 font-medium">
                    <span className="text-amber-400">⚡</span> Pague com <b>PIX</b> · aprovação na hora
                  </div>
                  <button
                    type="button"
                    onClick={() => setPixRevealed(true)}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF7A4D] via-[#F8545D] to-[#FFA230] text-white font-extrabold text-sm tracking-wide uppercase shadow-lg shadow-[#F8545D]/30 anim-pulse-sub cursor-pointer active:scale-[0.98] transition-all"
                  >
                    QUERO VIVER ESTE REENCONTRO
                  </button>
                  <p className="text-[11.5px] text-white/50 text-center mt-2.5 flex items-center justify-center gap-1">
                    <span>🔒</span> Pagamento 100% seguro via PIX
                  </p>
                </div>
              ) : (
                /* Revealed PIX Box */
                <div className="space-y-3 pt-1 animate-in fade-in duration-300">
                  <div className="text-center">
                    <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full mb-1">
                      ⚡ PIX · aprovação imediata
                    </span>
                    <div className="text-3xl font-black text-white">R$ 27,90</div>
                    <p className="text-xs text-white/60">
                      Pagamento único · seu vídeo chega no WhatsApp
                    </p>
                  </div>

                  {/* Big Green Copy Button */}
                  <button
                    type="button"
                    onClick={copyPixCode}
                    className={`relative overflow-hidden w-full py-4 rounded-xl font-black text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-[0.98] transition-all ${
                      pixCopied
                        ? "bg-emerald-400 text-emerald-950 shadow-emerald-500/30"
                        : "bg-gradient-to-b from-[#41E877] via-[#25C55B] to-[#17A94B] text-emerald-950 anim-pix-halo anim-pix-shine"
                    }`}
                  >
                    {pixCopied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                        <span>CÓDIGO PIX COPIADO!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-emerald-950" />
                        <span>COPIAR CÓDIGO E PAGAR</span>
                      </>
                    )}
                  </button>

                  {/* 3 Step Instruction */}
                  <ol className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-2 text-white/85">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E7C86B] text-black font-extrabold flex items-center justify-center text-[10px] flex-shrink-0">
                        1
                      </span>
                      <span>Abra o app do seu banco</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E7C86B] text-black font-extrabold flex items-center justify-center text-[10px] flex-shrink-0">
                        2
                      </span>
                      <span>Cole em <b>Pix Copia e Cola</b></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E7C86B] text-black font-extrabold flex items-center justify-center text-[10px] flex-shrink-0">
                        3
                      </span>
                      <span>Seu vídeo chega no <b>WhatsApp</b></span>
                    </li>
                  </ol>

                  {/* Collapsibles: Code and QR */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="text-xs text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-lg py-2 px-2 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>▾ Ver código</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQr(!showQr)}
                      className="text-xs text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-lg py-2 px-2 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver QR Code</span>
                    </button>
                  </div>

                  {showCode && (
                    <div className="pt-1">
                      <textarea
                        readOnly
                        value={pixCodeString}
                        className="w-full h-20 bg-black/60 border border-white/20 rounded-xl p-2.5 text-[11px] font-mono text-white/80 resize-none select-all focus:outline-none"
                      />
                    </div>
                  )}

                  {showQr && (
                    <div className="pt-1 text-center bg-white p-3 rounded-xl flex flex-col items-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          pixCodeString
                        )}`}
                        alt="QR Code PIX"
                        className="w-40 h-40 object-contain"
                      />
                      <span className="text-[11px] text-neutral-800 font-medium mt-1">
                        Aponte a câmera do app do banco
                      </span>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                    <div className="text-xs">
                      <strong className="block text-emerald-300">
                        Aguardando pagamento...
                      </strong>
                      <span className="text-white/60 text-[11px]">
                        Você não precisa fazer mais nada
                      </span>
                    </div>
                  </div>

                  {/* Interactive Demo Button so user can preview delivery screen */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen("delivery")}
                      className="w-full py-2.5 rounded-xl border border-amber-400/40 text-[#E7C86B] text-xs font-bold hover:bg-[#E7C86B]/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simular Pagamento Confirmado (Ver Vídeo)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Value Stack: O que você recebe */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 mb-4">
              <h2 className="text-sm font-extrabold text-[#E7C86B] mb-2 flex items-center gap-1.5">
                <span>✨</span> O que você recebe
              </h2>
              <ul className="space-y-2 text-xs text-white/85">
                <li className="flex items-start gap-2">
                  <span>🎬</span>
                  <span>O vídeo do reencontro de vocês, em movimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🎵</span>
                  <span>Com música emocionante e sem marca d'água</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span>Aparece na sua tela em ~2 minutos (+ cópia no WhatsApp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💳</span>
                  <span>Pagamento único — sem mensalidade</span>
                </li>
              </ul>
            </div>

            {/* Guarantee Box */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 mb-5 text-center flex flex-col items-center">
              <img
                src="https://eternizaamor.com/assets/img/guarantee-shield.png"
                alt="Garantia"
                className="w-12 h-12 object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h3 className="text-sm font-bold text-white mb-1">
                Emoção garantida ou seu dinheiro de volta
              </h3>
              <p className="text-xs text-white/70 leading-relaxed max-w-[280px]">
                Se o seu reencontro não tocar o seu coração, devolvemos 100% do seu dinheiro em até 14 dias.
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1">
                Sem pegadinha e sem mensalidade.
              </span>
            </div>

            {/* Social Proof Reviews Carousel */}
            <div className="mb-6">
              <div className="text-center mb-2.5">
                <span className="text-xs font-bold text-[#E7C86B]">
                  ⭐️ 4,9/5 · milhares de famílias emocionadas
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Depoimentos reais de quem viveu essa emoção 👇
                </h4>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={PROVAS[activeSlide]}
                  alt="Depoimento real"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-2.5">
                {PROVAS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === idx ? "w-6 bg-[#E7C86B]" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto text-center border-t border-white/10 pt-4 text-xs text-white/50 space-y-1">
              <div className="flex justify-center gap-4">
                <a href="#" className="hover:text-white">Termos de Uso</a>
                <span>•</span>
                <a href="#" className="hover:text-white">Política de Privacidade</a>
              </div>
              <div className="text-[11px]">contato@eternizaamor.com</div>
            </footer>

            {/* Sticky bottom bar when scrolling */}
            {showStickyBar && (
              <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-3 bg-gradient-to-t from-black via-black/90 to-transparent">
                <button
                  type="button"
                  onClick={() => {
                    setPixRevealed(true);
                    pixTargetRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full max-w-[420px] h-14 rounded-full bg-gradient-to-r from-[#FF7A4D] via-[#F8545D] to-[#FFA230] text-white font-extrabold text-sm tracking-wide uppercase shadow-2xl flex items-center justify-between px-6"
                >
                  <span>QUERO MEU REENCONTRO</span>
                  <span className="bg-black/30 px-3 py-1 rounded-full text-xs font-black">
                    R$ 27,90
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 7: ENTREGÁVEL / VÍDEO PRONTO & UPSELL
           ========================================================================= */}
        {currentScreen === "delivery" && (
          <div className="flex-1 flex flex-col justify-center px-4 py-8 animate-in fade-in duration-300">
            {!videoFinalReady ? (
              /* A luz que atravessa - Espera / Geração */
              <div className="text-center py-6">
                {/* 2 Avatars with light connection */}
                <div className="relative w-full max-w-[320px] mx-auto h-32 flex items-center justify-center">
                  <div className="absolute inset-0 anim-cena-ceu rounded-full pointer-events-none" />

                  {/* Sparkles */}
                  <span className="anim-fagulha absolute left-1/4 bottom-0 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-lg shadow-amber-300" />
                  <span
                    className="anim-fagulha absolute left-1/2 bottom-0 w-1 h-1 rounded-full bg-amber-200 shadow-lg shadow-amber-300"
                    style={{ animationDelay: "2s" }}
                  />
                  <span
                    className="anim-fagulha absolute left-3/4 bottom-0 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-lg shadow-amber-300"
                    style={{ animationDelay: "4s" }}
                  />

                  {/* Avatar You */}
                  <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900">
                    <img
                      src={fotoVoce || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                      alt="Você"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Light connecting beam */}
                  <div className="relative z-10 w-14 h-1 bg-gradient-to-r from-transparent via-[#E7C86B] to-transparent anim-cena-pulso" />

                  {/* Avatar Loved One */}
                  <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7C86B] shadow-2xl shadow-[#E7C86B]/30 bg-neutral-900 filter sepia-[0.2]">
                    <img
                      src={fotoPartiu || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"}
                      alt="Quem partiu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Steps List */}
                <ol className="mt-8 space-y-2 text-left max-w-[260px] mx-auto text-xs">
                  <li
                    className={`flex items-center gap-2.5 transition-colors ${
                      deliveringStep >= 1 ? "text-white font-bold" : "text-white/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        deliveringStep >= 1 ? "bg-[#E7C86B] shadow-sm shadow-[#E7C86B]" : "bg-white/20"
                      }`}
                    />
                    <span>Reconhecendo os rostos</span>
                  </li>
                  <li
                    className={`flex items-center gap-2.5 transition-colors ${
                      deliveringStep >= 2 ? "text-white font-bold" : "text-white/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        deliveringStep >= 2 ? "bg-[#E7C86B] shadow-sm shadow-[#E7C86B]" : "bg-white/20"
                      }`}
                    />
                    <span>Construindo o encontro</span>
                  </li>
                  <li
                    className={`flex items-center gap-2.5 transition-colors ${
                      deliveringStep >= 3 ? "text-white font-bold" : "text-white/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        deliveringStep >= 3 ? "bg-[#E7C86B] shadow-sm shadow-[#E7C86B]" : "bg-white/20"
                      }`}
                    />
                    <span>Dando vida à cena</span>
                  </li>
                </ol>

                <h2 className="text-lg font-bold text-white mt-6">
                  Estamos preparando o encontro de vocês
                </h2>
                <p className="text-xs text-[#E7C86B] font-semibold mt-1.5 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Costuma levar alguns instantes</span>
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Fica aqui com a gente — ele aparece nesta tela 💛
                </p>
              </div>
            ) : (
              /* Final Deliverable: Vídeo Pronto */
              <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
                  🎉 Seu reencontro está pronto!
                </div>
                <h1 className="text-xl font-bold text-white mb-4">
                  O abraço de vocês ganhou vida 💛
                </h1>

                {/* Final Video Player */}
                <div className="w-full max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-[#E7C86B]/40 bg-black mb-4">
                  <video
                    src={selectedScenario.video}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Download and Share Buttons */}
                <div className="space-y-2 max-w-[320px] mx-auto mb-6">
                  <a
                    href={selectedScenario.video}
                    download="meu-reencontro-eterniza.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar meu vídeo</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Meu Reencontro Eterniza",
                          text: "Olha que lindo o vídeo que criei no Eterniza!",
                          url: window.location.href,
                        });
                      } else {
                        copyPixCode();
                        alert("Link copiado para a área de transferência!");
                      }
                    }}
                    className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar com a família</span>
                  </button>
                </div>

                {/* Upsell: Outro Cenário */}
                <div className="bg-gradient-to-b from-[#E7C86B]/15 to-[#E7C86B]/5 border border-[#E7C86B]/30 rounded-2xl p-4 max-w-[320px] mx-auto text-center mb-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E7C86B] bg-[#E7C86B]/15 px-2 py-0.5 rounded-full">
                    OFERTA ESPECIAL
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 mb-1">
                    Vocês dois, em outro cenário
                  </h3>
                  <p className="text-xs text-white/70 mb-3">
                    Use as mesmas fotos para criar outra linda memória.
                  </p>

                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-xs text-white/40 line-through">R$ 27,00</span>
                    <span className="text-2xl font-black text-[#E7C86B]">R$ 19,90</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen("scenarios");
                    }}
                    className="w-full py-3 rounded-full bg-[#E7C86B] hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wide transition-all shadow-md active:scale-[0.98]"
                  >
                    APROVEITAR DESCONTO
                  </button>
                  <p className="text-[10px] text-white/50 mt-2">
                    Desconto só nesta tela · pronto em minutos
                  </p>
                </div>

                <p className="text-xs text-white/60">
                  Enviamos uma cópia também no seu WhatsApp 💛
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
