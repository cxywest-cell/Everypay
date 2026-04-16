export interface CorridorFormat {
  corridor: "BRL" | "ARS" | "USD" | "HKD";
  symbol: string;
  locale: string;
  code: string;
}

const CORRIDOR_MAP: Record<string, CorridorFormat> = {
  BRL: { corridor: "BRL", symbol: "R$", locale: "pt-BR", code: "BRL" },
  ARS: { corridor: "ARS", symbol: "$", locale: "es-AR", code: "ARS" },
  USD: { corridor: "USD", symbol: "$", locale: "en-US", code: "USD" },
  HKD: { corridor: "HKD", symbol: "HK$", locale: "en-HK", code: "HKD" },
};

export function formatCorridorAmount(amount: number, corridor: string): string {
  const config = CORRIDOR_MAP[corridor] || CORRIDOR_MAP.USD;
  return `${config.symbol} ${new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} ${config.code}`;
}

export function getCorridorComplianceNotation(corridor: string): string {
  switch (corridor) {
    case "BRL":
      return "BCB compliant";
    case "ARS":
      return "BCRA Res. 8430/2020";
    default:
      return "";
  }
}
