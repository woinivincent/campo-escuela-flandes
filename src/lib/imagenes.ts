/**
 * Qué imágenes hay subidas hoy.
 *
 * Vive acá y no dentro del panel porque las páginas públicas también lo
 * necesitan: las galerías muestran las fotos que existen, no una cantidad fija.
 *
 * Igual que el resto del sitio, usa Netlify Blobs cuando está disponible y la
 * carpeta `public/images` cuando no (desarrollo local). No se mira el entorno:
 * se intenta abrir el store y, si no responde, se cae al filesystem.
 */

import { cache } from "react";
import { getBlobStore } from "@/lib/blobs";

/**
 * Las claves de imagen que tienen archivo subido.
 *
 * Envuelto en `cache()` para que, dentro de un mismo render, varias secciones
 * que pregunten por galerías distintas compartan un solo listado en vez de
 * pedirle la lista al store una vez por sección.
 *
 * Nunca lanza: si el listado falla, devuelve un conjunto vacío. Una galería de
 * menos es un problema mucho más chico que una página que no abre.
 */
export const imagenesExistentes = cache(async (): Promise<Set<string>> => {
  const store = await getBlobStore("site-images");
  if (store) {
    try {
      const { blobs } = await store.list();
      return new Set(blobs.map((b) => b.key));
    } catch {
      return new Set();
    }
  }

  try {
    const { readdir } = await import("fs/promises");
    const { join } = await import("path");
    const archivos = await readdir(join(process.cwd(), "public", "images"));
    // Se lee la carpeta entera en lugar de preguntar por cada clave conocida:
    // así aparecen también las fotos de cosas que se cargaron desde el panel,
    // que es justamente lo que no se podía hacer antes.
    return new Set(
      archivos
        .filter((a) => /\.(jpe?g|png|webp|avif|gif)$/i.test(a))
        .map((a) => a.replace(/\.[^.]+$/, ""))
    );
  } catch {
    return new Set();
  }
});

/**
 * Las fotos de una galería, en orden, mirando las que realmente están subidas.
 *
 * Se numeran desde 1 y se corta en el primer hueco: si están la 1, 2 y 4, se
 * muestran la 1 y la 2. Cortar en el hueco evita que al quitar una foto del
 * medio queden los huecos a la vista en la página.
 */
export async function fotosDeGaleria(prefijo: string): Promise<string[]> {
  const existentes = await imagenesExistentes();
  const fotos: string[] = [];
  for (let i = 1; ; i++) {
    const clave = `${prefijo}-${i}`;
    if (!existentes.has(clave)) break;
    fotos.push(clave);
  }
  return fotos;
}

/**
 * Hasta qué número llega una galería, contando también las que quedaron
 * después de un hueco.
 *
 * El panel sí necesita ver los huecos —para poder llenarlos— así que usa esto
 * en vez de `fotosDeGaleria`.
 */
export async function ultimaDeGaleria(prefijo: string): Promise<number> {
  const existentes = await imagenesExistentes();
  let ultima = 0;
  for (const clave of existentes) {
    const m = new RegExp(`^${prefijo}-(\\d+)$`).exec(clave);
    if (m) ultima = Math.max(ultima, Number(m[1]));
  }
  return ultima;
}
