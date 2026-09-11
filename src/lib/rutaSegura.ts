/**
 * Saneamiento del nombre de archivo que llega por la URL.
 *
 * Las rutas `/images/*` y `/docs/*` arman el nombre con los segmentos de la URL
 * y, cuando el almacenamiento no responde, lo usan para leer del disco. Sin
 * controlar, una serie de `..` puede salir del directorio previsto y servir
 * cualquier archivo del proyecto.
 *
 * No se confía en que el framework normalice el path antes: es una suposición
 * sobre código ajeno que puede cambiar con cualquier actualización.
 */

/** Un segmento vale si no es un salto hacia arriba ni trae separadores propios. */
function segmentoValido(segmento: string): boolean {
  if (segmento === "" || segmento === "." || segmento === "..") return false;
  if (segmento.includes("/") || segmento.includes("\\")) return false;
  // El byte nulo puede truncar la ruta en capas más abajo.
  if (segmento.includes("\0")) return false;
  return true;
}

/**
 * Devuelve el nombre de archivo si los segmentos son seguros, o null si no.
 * Quien llama decide qué responder: para estas rutas, un 404.
 */
export function nombreDeArchivoSeguro(segmentos: string[]): string | null {
  if (!Array.isArray(segmentos) || segmentos.length === 0) return null;
  if (!segmentos.every(segmentoValido)) return null;
  return segmentos.join("/");
}

/**
 * Limpia el nombre antes de ponerlo en una cabecera.
 *
 * Un salto de línea dentro de un `Content-Disposition` permite inyectar otras
 * cabeceras, y una comilla corta el valor antes de tiempo.
 */
export function nombreParaCabecera(nombre: string): string {
  return nombre.replace(/[^\w.\- ]+/g, "_");
}
