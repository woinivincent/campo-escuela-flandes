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

// ─── Ficha para señalizar el predio ──────────────────────────────────────────

/**
 * Medidas de la ficha, en milímetros.
 *
 * Van en mm y no en píxeles porque estas fichas se imprimen y se pegan en el
 * predio: lo que importa es cuánto miden en el árbol, no en la pantalla. A
 * 70x100 entran seis por hoja A4 con margen para cortar.
 */
export const FICHA = { ancho: 70, alto: 115 };

function escaparXml(t: string): string {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Parte el texto en varias líneas si no entra a lo ancho de la ficha.
 * Es una estimación por cantidad de caracteres, suficiente para nombres de
 * especies: no hay forma de medir texto sin un motor de render.
 */
function enLineas(texto: string, porLinea: number): string[] {
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of palabras) {
    const tentativa = actual ? actual + " " + palabra : palabra;
    if (tentativa.length > porLinea && actual) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = tentativa;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

export interface DatosFicha {
  nombreComun: string;
  nombreCientifico: string;
  categoria?: string;
}

/** La paleta del sitio, para que el cartel del predio y la web se parezcan. */
const COLOR = {
  forestDark: "#1E4527",
  forest: "#2F6B3C",
  forestPale: "#E8F1E9",
  gold: "#F2B705",
  sand: "#F7F4EC",
  sandDark: "#EDE7D8",
  gris: "#6B7280",
};

/**
 * Ficha completa lista para imprimir, con la estética del sitio: banda verde
 * con el nombre del campo, el QR sobre blanco y el nombre de la especie grande.
 *
 * El nombre es lo importante: sin él, veintitrés códigos impresos son
 * veintitrés cuadrados iguales y no hay forma de saber cuál va en qué árbol.
 *
 * Sale en SVG porque escala sin perder nitidez —el QR también— y porque una
 * imprenta lo abre sin problema.
 */
export async function fichaQrSvg(
  datos: DatosFicha,
  url: string,
  campo: string
): Promise<string> {
  const qr = await QRCode.toString(url, { ...QR_OPTIONS, type: "svg" });

  // El SVG del QR se anida entero: así conserva su viewBox y se escala solo.
  const interior = qr.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const viewBox = qr.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 37 37";

  const { ancho, alto } = FICHA;
  const medio = ancho / 2;

  // Franjas horizontales de la ficha, de arriba abajo. Se fijan las tres de los
  // extremos y el nombre se centra en el hueco que queda: así entra igual de
  // bien un nombre de una línea que uno de dos.
  const finCabecera = 19;
  const marco = { x: 13, y: 23, lado: 44 };
  const finQr = marco.y + marco.lado;
  const chip = { y: finQr + 4, alto: 5.5 };
  const finChip = chip.y + chip.alto;
  const yRegla = alto - 15;

  // Cabecera verde con las curvas de nivel del sitio, apenas insinuadas.
  const ondas = [6, 11, 16]
    .map(
      (y) =>
        `<path d="M-4 ${y} q 12 -3 24 0 t 24 0 t 24 0 t 24 0" fill="none" ` +
        `stroke="${COLOR.gold}" stroke-width="0.35" opacity="0.28"/>`
    )
    .join("");

  const lineas = enLineas(datos.nombreComun.toUpperCase(), 15);
  const altoBloque = lineas.length * 6.2 + 5.2;
  const yNombre = finChip + (yRegla - finChip - altoBloque) / 2 + 5;

  const nombre = lineas
    .map(
      (linea, i) =>
        `<text x="${medio}" y="${yNombre + i * 6.2}" text-anchor="middle" ` +
        `font-family="Helvetica, Arial, sans-serif" font-size="5.6" font-weight="700" ` +
        `letter-spacing="-0.1" fill="${COLOR.forestDark}">${escaparXml(linea)}</text>`
    )
    .join("");
  const yCientifico = yNombre + lineas.length * 6.2 - 0.4;

  // Etiqueta de categoría, como los chips verdes del sitio.
  const cat = (datos.categoria ?? "").toUpperCase();
  const anchoChip = Math.max(17, cat.length * 2 + 9);
  const etiqueta = cat
    ? `<rect x="${medio - anchoChip / 2}" y="${chip.y}" width="${anchoChip}" height="${chip.alto}" rx="${chip.alto / 2}" fill="${COLOR.forestPale}"/>
  <text x="${medio}" y="${chip.y + 3.9}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="3.1" font-weight="700" letter-spacing="0.6" fill="${COLOR.forest}">${escaparXml(cat)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}mm" height="${alto}mm" viewBox="0 0 ${ancho} ${alto}">
  <rect width="${ancho}" height="${alto}" fill="${COLOR.sand}"/>

  <!-- Cabecera -->
  <path d="M0 0 h${ancho} v${finCabecera} H0 Z" fill="${COLOR.forestDark}"/>
  <clipPath id="cab"><rect width="${ancho}" height="${finCabecera}"/></clipPath>
  <g clip-path="url(#cab)">${ondas}</g>
  <text x="${medio}" y="9.4" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="4.3" font-weight="700" letter-spacing="0.2" fill="${COLOR.gold}">${escaparXml(campo.toUpperCase())}</text>
  <text x="${medio}" y="14.3" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="2.4" letter-spacing="0.7" fill="#BFD3C4">CAMPO DE EJERCICIOS SCOUTS</text>

  <!-- El QR, sobre blanco para que lea bien -->
  <rect x="${marco.x}" y="${marco.y}" width="${marco.lado}" height="${marco.lado}" rx="3" fill="#ffffff" stroke="${COLOR.sandDark}" stroke-width="0.5"/>
  <svg x="${marco.x + 2.5}" y="${marco.y + 2.5}" width="${marco.lado - 5}" height="${marco.lado - 5}" viewBox="${viewBox}">${interior}</svg>

  ${etiqueta}

  ${nombre}
  <text x="${medio}" y="${yCientifico}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="3.6" font-style="italic" fill="${COLOR.gris}">${escaparXml(datos.nombreCientifico)}</text>

  <!-- Pie -->
  <line x1="16" y1="${yRegla}" x2="${ancho - 16}" y2="${yRegla}" stroke="${COLOR.gold}" stroke-width="0.6"/>
  <text x="${medio}" y="${yRegla + 4.8}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="2.9" fill="${COLOR.forest}">Escaneá el código con la cámara</text>
  <text x="${medio}" y="${yRegla + 8.6}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="2.9" fill="${COLOR.forest}">para conocer esta especie</text>
</svg>`;
}

/** Nombre de archivo de la ficha. */
export function fichaFileName(nombreComun: string): string {
  return qrFileName(nombreComun).replace(/^qr-/, "ficha-").replace(/\.png$/, ".svg");
}

/** SVG como data URL, para poder descargarlo desde un enlace. */
export function svgDataUrl(svg: string): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
