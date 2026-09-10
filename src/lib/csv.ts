/**
 * Lector de CSV, sin dependencias.
 *
 * Está pensado para lo que sale de Excel al hacer *Guardar como → CSV*:
 * separador coma o punto y coma según el idioma del Office, comillas alrededor
 * de los campos que contienen el separador, y un BOM al principio del archivo.
 *
 * Corre igual en el navegador y en el servidor: no usa nada de Node.
 */

export interface CsvLeido {
  encabezados: string[];
  filas: string[][];
  /** El separador que se terminó usando, para poder mostrarlo. */
  separador: string;
}

const SEPARADORES = [",", ";", "\t"];

/**
 * Separa el texto en filas y campos.
 *
 * Respeta las comillas dobles: adentro, el separador y los saltos de línea son
 * texto común, y `""` es una comilla escapada.
 */
function separar(texto: string, sep: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let enComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (enComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          enComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') {
      enComillas = true;
    } else if (c === sep) {
      fila.push(campo);
      campo = "";
    } else if (c === "\n") {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = "";
    } else if (c !== "\r") {
      campo += c;
    }
  }

  // La última fila, si el archivo no termina en salto de línea.
  if (campo !== "" || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  return filas;
}

/**
 * Elige el separador probando cada uno y quedándose con el que parte el
 * encabezado en más columnas. Con una sola columna todos empatan y da igual.
 */
function detectarSeparador(texto: string): string {
  let mejor = SEPARADORES[0];
  let columnas = 0;
  for (const sep of SEPARADORES) {
    const primera = separar(texto, sep)[0] ?? [];
    if (primera.length > columnas) {
      columnas = primera.length;
      mejor = sep;
    }
  }
  return mejor;
}

/** Lee un CSV completo. La primera fila se toma como encabezado. */
export function parseCsv(textoCrudo: string): CsvLeido {
  // Excel escribe un BOM al guardar como "CSV UTF-8".
  const texto = textoCrudo.replace(/^﻿/, "");
  const separador = detectarSeparador(texto);
  const todas = separar(texto, separador);

  if (todas.length === 0) {
    return { encabezados: [], filas: [], separador };
  }

  const encabezados = todas[0].map((h) => h.trim());
  const filas = todas
    .slice(1)
    // Excel suele dejar filas vacías al final.
    .filter((f) => f.some((c) => c.trim() !== ""));

  return { encabezados, filas, separador };
}
