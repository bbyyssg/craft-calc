import type { Lang } from "../site";

// Shared UI strings. Written by AI — needs review by native speakers (es, pt-BR) before launch.
export const UI = {
  es: {
    tagline: "Calculadoras gratis para tejer, hacer ganchillo y velas",
    nav: { distribute: "Aumentos", circle: "Círculo", gauge: "Muestra", candle: "Velas" },
    toolNames: {
      distribute: "Calculadora de aumentos y disminuciones",
      circle: "Calculadora de círculo de ganchillo",
      gauge: "Calculadora de muestra (tensión)",
      candle: "Calculadora de fragancia para velas",
    },
    toolBlurbs: {
      distribute: "Reparte aumentos o disminuciones de forma uniforme en una vuelta, en plano o en redondo.",
      circle: "Puntos e instrucciones de cada vuelta para un círculo plano de ganchillo, con aumentos alternados.",
      gauge: "Calcula puntos y vueltas para una medida y adapta un patrón a tu muestra.",
      candle: "Gramos de cera y de fragancia para tus velas a partir del envase o del peso final.",
    },
    switchLang: "Português",
    lastReviewed: "Fórmulas revisadas",
    disclaimerShort: "Resultados orientativos. Comprueba siempre tu muestra y las indicaciones del fabricante.",
    footerLinks: { about: "Acerca de", privacy: "Privacidad" },
    faq: "Preguntas frecuentes",
    sources: "Fuentes",
    calc: "Calcular",
  },
  pt: {
    tagline: "Calculadoras grátis para tricô, crochê e velas",
    nav: { distribute: "Aumentos", circle: "Círculo", gauge: "Amostra", candle: "Velas" },
    toolNames: {
      distribute: "Calculadora de aumentos e diminuições",
      circle: "Calculadora de círculo de crochê",
      gauge: "Calculadora de amostra (tensão)",
      candle: "Calculadora de essência para velas",
    },
    toolBlurbs: {
      distribute: "Distribui aumentos ou diminuições por igual na carreira, em tricô reto ou circular.",
      circle: "Pontos e instruções de cada carreira para um círculo plano de crochê, com aumentos alternados.",
      gauge: "Calcula pontos e carreiras para uma medida e adapta uma receita à sua amostra.",
      candle: "Gramas de cera e de essência para suas velas a partir do recipiente ou do peso final.",
    },
    switchLang: "Español",
    lastReviewed: "Fórmulas revisadas em",
    disclaimerShort: "Resultados aproximados. Confira sempre sua amostra e as indicações do fabricante.",
    footerLinks: { about: "Sobre", privacy: "Privacidade" },
    faq: "Perguntas frequentes",
    sources: "Fontes",
    calc: "Calcular",
  },
} as const;

export function ui(lang: Lang) {
  return UI[lang];
}

export function numberLocale(lang: Lang): string {
  return lang === "es" ? "es-ES" : "pt-BR";
}
