import QRCode from "qrcode";

/** Opciones de render compartidas: alto contraste y margen chico para impresión. */
const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const, // tolera suciedad/desgaste en el predio
  margin: 1,
  color: { dark: "#1d2b1a", light: "#ffffff" },
};

/** Genera el QR como data URL PNG (para <img> y para descargar). */
export async function qrDataUrl(text: string, width = 512): Promise<string> {
  return QRCode.toDataURL(text, { ...QR_OPTIONS, width });
}

/** Genera el QR como string SVG (escala sin perder calidad al imprimir). */
export async function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { ...QR_OPTIONS, type: "svg" });
}

/** URL pública a la que apunta el QR de una especie. */
export function especieQrUrl(siteUrl: string, especieId: string): string {
  const base = siteUrl.replace(/\/+$/, "");
  return `${base}/naturaleza/${especieId}`;
}

/** Nombre de archivo seguro para la descarga. */
export function qrFileName(nombreComun: string): string {
  const slug = nombreComun
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // quita tildes/diacríticos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `qr-${slug}.png`;
}
