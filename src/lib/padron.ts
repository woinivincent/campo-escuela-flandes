/**
 * Reglas del padrón de socios, compartidas por el panel y el servidor.
 *
 * El navegador las usa para mostrar la vista previa; el servidor las vuelve a
 * aplicar antes de guardar, porque lo que llega del formulario no es confiable.
 * Sin dependencias de Node: este módulo lo importa un componente cliente.
 */

export interface FilaPadron {
  nombre: string;
  email: string;
}

export type EstadoFila =
  | "ok"
  | "sin-nombre"
  | "sin-email"
  | "email-invalido"
  | "repetido-en-archivo"
  | "ya-existe";

export const MOTIVOS: Record<EstadoFila, string> = {
  ok: "Se va a importar",
  "sin-nombre": "Falta el nombre",
  "sin-email": "Falta el email",
  "email-invalido": "El email no parece válido",
  "repetido-en-archivo": "El email se repite en la planilla",
  "ya-existe": "Ya hay un socio con ese email",
};

/**
 * Cuántas filas se aceptan de una vez.
 *
 * El límite lo pone el hasheo, no el parser. bcrypt tarda unos 300 ms por
 * contraseña y bcryptjs es de un solo hilo, así que no se puede paralelizar:
 * cien socios son treinta segundos de CPU. Las funciones de Netlify cortan a
 * los diez, de modo que un padrón grande hay que subirlo en tandas.
 */
export const MAX_FILAS = 2000;

/**
 * Cuántas filas se mandan por vez.
 *
 * Medido: quince filas tardaban 8,5 segundos, demasiado cerca del límite de
 * diez segundos de Netlify. Con ocho queda la mitad de margen, que es lo que
 * hace falta porque producción puede ser más lenta que una máquina de
 * desarrollo. El navegador manda las tandas una tras otra hasta terminar.
 */
export const TAMANO_TANDA = 8;

export function normalizarEmail(v: string): string {
  return v.trim().toLowerCase();
}

/** Chequeo deliberadamente laxo: algo@algo.algo. */
export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * Clasifica cada fila. `yaExisten` son los emails que ya están en el padrón.
 * Recorre en orden: de dos filas con el mismo email, la primera entra y la
 * segunda queda marcada como repetida.
 */
export function revisarFilas(
  filas: FilaPadron[],
  yaExisten: Set<string>
): { fila: FilaPadron; estado: EstadoFila }[] {
  const vistos = new Set<string>();

  return filas.map((cruda) => {
    const fila = {
      nombre: cruda.nombre.trim(),
      email: normalizarEmail(cruda.email),
    };

    let estado: EstadoFila = "ok";
    if (!fila.nombre) estado = "sin-nombre";
    else if (!fila.email) estado = "sin-email";
    else if (!emailValido(fila.email)) estado = "email-invalido";
    else if (vistos.has(fila.email)) estado = "repetido-en-archivo";
    else if (yaExisten.has(fila.email)) estado = "ya-existe";

    if (estado === "ok") vistos.add(fila.email);
    return { fila, estado };
  });
}

/**
 * Adivina qué columna es cuál mirando el encabezado. Devuelve el índice, o -1.
 * Sirve para dejar los selectores ya elegidos y que casi nunca haya que tocarlos.
 */
export function adivinarColumna(
  encabezados: string[],
  cual: "nombre" | "email"
): number {
  const pistas =
    cual === "nombre"
      ? ["nombre y apellido", "nombre", "apellido y nombre", "socio", "apellido"]
      : ["email", "e-mail", "mail", "correo", "correo electrónico"];

  const normal = encabezados.map((h) => h.trim().toLowerCase());

  for (const pista of pistas) {
    const exacto = normal.indexOf(pista);
    if (exacto !== -1) return exacto;
  }
  for (const pista of pistas) {
    const parcial = normal.findIndex((h) => h.includes(pista));
    if (parcial !== -1) return parcial;
  }
  return -1;
}
