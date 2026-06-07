import { useState } from "react";
import {
  Sword, Heart, Crosshair, RefreshCw, MousePointer2, FileCode2,
  Check, Shield, Download, Play, ChevronDown, Gift, Zap,
} from "lucide-react";
import logo from "./assets/logo.png";

const BACKEND = "https://tibia-toolkit-production.up.railway.app";

const features = [
  { icon: Sword,         title: "Cavebot",              desc: "Navegação automática entre waypoints com scripts totalmente personalizáveis." },
  { icon: Heart,         title: "Auto-Heal",            desc: "Monitoramento de HP/MP em tempo real com hotkeys configuráveis para cada situação." },
  { icon: Crosshair,     title: "Combate",              desc: "Ciclo automático de magias de ataque com detecção inteligente de monstros." },
  { icon: RefreshCw,     title: "Auto-Update",          desc: "Launcher verifica e aplica atualizações automaticamente. Sempre na última versão." },
  { icon: MousePointer2, title: "Movimento Humanizado", desc: "Cliques com curvas naturais e velocidade variável, simulando um jogador real." },
  { icon: FileCode2,     title: "Editor de Scripts",    desc: "Crie e edite waypoints da sua hunt pela interface gráfica, sem código." },
];

const faqs = [
  {
    q: "Como funciona o trial gratuito de 3 dias?",
    a: "Você baixa o launcher, cria uma conta e cadastra seu cartão no checkout. Não há nenhuma cobrança nos primeiros 3 dias. A partir do 4º dia, a assinatura de R$ 29,90/mês é ativada automaticamente. Se cancelar antes, não paga nada.",
  },
  {
    q: "O Tibia Toolkit é 100% AFK?",
    a: "Ainda não — o programa está em desenvolvimento ativo e recebe atualizações regulares com novas automações. Hoje cobrimos cavebot, auto-heal e combate, e novas features são lançadas constantemente.",
  },
  {
    q: "Posso cancelar a assinatura quando quiser?",
    a: "Sim. Você cancela a qualquer momento e mantém o acesso até o fim do período já pago.",
  },
  {
    q: "Funciona em qual cliente do Tibia?",
    a: "Compatível com o cliente Global (oficial) e com OTServers. Para detalhes técnicos consulte a documentação.",
  },
  {
    q: "Quais sistemas operacionais são suportados?",
    a: "Windows (.exe) e Linux (AppImage). Detalhes técnicos específicos do Windows estão na documentação.",
  },
  {
    q: "E se eu tiver dúvidas ou problemas?",
    a: "Temos comunidade ativa e suporte direto. Você fala com quem desenvolve a ferramenta.",
  },
];

export default function App() {
  return (
    <div className="app">
      <TrialBanner />
      <Nav />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function TrialBanner() {
  return (
    <div className="trial-banner">
      <div className="trial-banner__shimmer animate-shimmer" />
      <span className="trial-banner__text">
        <Gift size={16} />
        3 dias grátis — sem cobrança até o 4º dia · Cancele quando quiser
        <Gift size={16} />
      </span>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <img src={logo} alt="Tibia Toolkit" className="nav__logo" width={36} height={36} />
          <span className="brand-name text-gold-gradient">TIBIA TOOLKIT</span>
        </a>
        <nav className="nav__links">
          <a href="#features">Recursos</a>
          <a href="#pricing">Preços</a>
          <a href="#faq">FAQ</a>
          <a href="#download">Download</a>
          <a href="/documentacao">Docs</a>
        </nav>
        <a href="#pricing" className="btn btn--gold btn--sm">Assinar</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__inner">
        <div className="hero__content animate-fade-up">
          <div className="hero__logo-wrap">
            <img src={logo} alt="Tibia Toolkit" className="hero__logo animate-float" />
          </div>
          <div className="hero__badge">
            <span className="hero__badge-dot animate-pulse" />
            Em desenvolvimento ativo · Atualizações regulares
          </div>
          <h1 className="hero__title">
            Automatize sua <span className="text-gold-gradient">Hunt</span>
          </h1>
          <p className="hero__subtitle">
            Cavebot, auto-heal e combate automáticos para Tibia. Foque na estratégia —
            o Toolkit cuida do resto.
          </p>
          <div className="hero__actions">
            <a href="#pricing" className="btn btn--gold btn--lg">
              <Download size={16} /> Teste grátis
            </a>
            <a href="#features" className="btn btn--outline btn--lg">
              <Play size={16} /> Ver recursos
            </a>
          </div>
          <div className="hero__trust">
            <span className="hero__trust-item hero__trust-item--primary">
              <Gift size={16} /> 3 dias grátis
            </span>
            <span className="hero__trust-item"><Shield size={16} /> Cancele quando quiser</span>
            <span className="hero__trust-item"><RefreshCw size={16} /> Updates inclusos</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Recursos</p>
          <h2 className="section__title">
            Automatize sua <span className="text-gold-gradient">Hunt.</span> Foque na estratégia.
          </h2>
          <p className="section__subtitle">
            Ferramentas integradas em um único launcher, sempre atualizado.
          </p>
        </div>
        <div className="features__grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon"><f.icon size={24} /></div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const perks = [
    { text: "3 dias grátis — sem cobrança até o 4º dia", highlight: true },
    { text: "Acesso completo a todos os recursos", highlight: false },
    { text: "Atualizações automáticas incluídas", highlight: false },
    { text: "Novas features em desenvolvimento ativo", highlight: false },
    { text: "Suporte direto da comunidade", highlight: false },
    { text: "Cancele quando quiser", highlight: false },
  ];

  return (
    <section id="pricing" className="section">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Preços</p>
          <h2 className="section__title">
            Um plano. <span className="text-gold-gradient">Tudo incluso.</span>
          </h2>
          <p className="section__subtitle">
            3 dias grátis para testar. Depois R$ 29,90/mês no lançamento. Cancele quando quiser.
          </p>
        </div>

        <div className="pricing__card-wrap">
          <div className="pricing-card">
            <div className="pricing-card__badge">
              <span><Zap size={14} /> 3 DIAS GRÁTIS</span>
            </div>

            <div className="pricing-card__launch">
              <Zap size={12} /> Preço de lançamento — sobe para R$ 39,90 em breve
            </div>
            <h3 className="pricing-card__plan">Mensal</h3>
            <div className="pricing-card__price-block">
              <span className="pricing-card__old">R$ 39,90/mês</span>
              <div className="pricing-card__price-row">
                <span className="pricing-card__price text-gold-gradient">R$ 29,90</span>
                <span className="pricing-card__per">/mês</span>
              </div>
            </div>
            <p className="pricing-card__note">após o período gratuito de 3 dias</p>
            <ul className="pricing-card__perks">
              {perks.map((perk) => (
                <li key={perk.text} className={`perk${perk.highlight ? " perk--highlight" : ""}`}>
                  <Check size={16} className="perk__icon" />
                  <span>{perk.text}</span>
                </li>
              ))}
            </ul>
            <a href="#download" className="btn btn--gold btn--block">Começar trial gratuito</a>
          </div>
        </div>

        <div id="download" className="download">
          <h3 className="download__title">Baixe o Launcher</h3>
          <p className="download__note">
            Requer assinatura ativa. Atualiza-se sozinho.
          </p>
          <div className="download__actions">
            <a
              className="btn btn--gold btn--lg"
              href={`${BACKEND}/version/download?platform=windows`}
              data-umami-event="download"
              data-umami-event-platform="windows"
            >
              <Download size={16} /> Windows .exe
            </a>
            <a
              className="btn btn--outline btn--lg"
              href={`${BACKEND}/version/download?platform=linux`}
              data-umami-event="download"
              data-umami-event-platform="linux"
            >
              <Download size={16} /> Linux AppImage
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section">
      <div className="container container--narrow">
        <div className="faq__head">
          <p className="eyebrow">FAQ</p>
          <h2 className="section__title">
            Perguntas <span className="text-gold-gradient">frequentes</span>
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-item__q"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <ChevronDown
                  size={20}
                  className={`faq-item__chevron${open === i ? " is-open" : ""}`}
                />
              </button>
              {open === i && (
                <div className="faq-item__a animate-fade-up">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-row">
            <img src={logo} alt="" className="footer__logo" width={32} height={32} loading="lazy" />
            <span className="brand-name text-gold-gradient">TIBIA TOOLKIT</span>
          </div>
          <p className="footer__tagline">
            Em desenvolvimento ativo com atualizações regulares.
          </p>
        </div>
        <div>
          <h4 className="footer__col-title">Produto</h4>
          <ul className="footer__links">
            <li><a href="#features">Recursos</a></li>
            <li><a href="#pricing">Preços</a></li>
            <li><a href="#download">Download</a></li>
            <li><a href="/documentacao">Documentação</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer__col-title">Legal</h4>
          <ul className="footer__links">
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Tibia Toolkit. Não afiliado à CipSoft.</p>
        </div>
      </div>
    </footer>
  );
}
