/**
 * Arma la lista completa de lugares para imágenes.
 *
 * Los fijos salen de `imageSlots.ts`. El resto se deduce de lo que hay
 * cargado: una foto por especie, por libro y por material de la biblioteca,
 * más las galerías, que crecen solas.
 *
 * La consecuencia buscada es que cargar una especie nueva en *Naturaleza*
 * alcance para que su lugar de foto aparezca en *Imágenes*, sin tocar código.
 */

import { getEspecies, getLibros, getMateriales } from "@/lib/db";
import { ultimaDeGaleria } from "@/lib/imagenes";
import { SLOTS_FIJOS, GALERIAS, type ImageSlot } from "./imageSlots";

/** Hasta cuántas fotos puede tener una galería. */
export const MAX_GALERIA = 200;

/** Un lugar de galería incluye si es el vacío del final, para poder marcarlo. */
export interface SlotGaleria extends ImageSlot {
  /** El último, vacío, que existe solo para poder sumar una foto más. */
  paraAgregar?: boolean;
}

export async function getImageSlots(): Promise<SlotGaleria[]> {
  const [especies, libros, materiales] = await Promise.all([
    getEspecies(),
    getLibros(),
    getMateriales(),
  ]);

  // Flora y Fauna. `categoria` ya vale "Flora" o "Fauna", que son los mismos
  // nombres que los grupos del panel.
  //
  // Ojo: las especies que hoy muestran una foto de Wikimedia Commons la traen
  // desde ahí. Si acá se sube una foto del campo, pisa a la de Commons y hay
  // que sacar su crédito de `src/config/creditosFotos.ts`.
  const deEspecies: ImageSlot[] = especies.map((e) => ({
    id: `especie-${e.id}`,
    label: e.nombreComun,
    group: e.categoria,
    desc: e.nombreCientifico,
  }));

  const deLibros: ImageSlot[] = libros.map((l) => ({
    id: `libro-${l.id}`,
    label: l.titulo,
    group: "Libros",
    desc: l.autor ? `Tapa · ${l.autor}` : "Tapa del libro",
  }));

  const deMateriales: ImageSlot[] = materiales.map((m) => ({
    id: m.id,
    label: m.titulo,
    group: "Biblioteca",
    desc: "Portada del material",
  }));

  const deGalerias: SlotGaleria[] = [];
  for (const g of GALERIAS) {
    const ultima = await ultimaDeGaleria(g.prefijo);
    // Se muestran las que hay (o el mínimo, lo que sea mayor) y una vacía más
    // al final, que es el botón de "agregar otra".
    const cuantas = Math.min(Math.max(ultima, g.minimo) + 1, MAX_GALERIA);
    for (let i = 1; i <= cuantas; i++) {
      deGalerias.push({
        id: `${g.prefijo}-${i}`,
        label: `${g.label} ${i}`,
        group: g.group,
        desc: g.desc,
        paraAgregar: i > ultima && i === cuantas,
      });
    }
  }

  return [...SLOTS_FIJOS, ...deEspecies, ...deLibros, ...deMateriales, ...deGalerias];
}

/**
 * Si una clave de imagen se puede escribir.
 *
 * Lo usa la acción de subir y la de borrar. No alcanza con mirar la lista de
 * arriba: una galería puede crecer más allá del último hueco que el panel
 * mostró, así que las claves `galeria-N` se aceptan por su forma.
 */
export async function slotValido(id: string): Promise<boolean> {
  for (const g of GALERIAS) {
    const m = new RegExp(`^${g.prefijo}-(\\d+)$`).exec(id);
    // El tope no es por seguridad —para subir hay que estar logueado— sino para
    // que un número disparatado no haga que el panel intente dibujar después
    // esa cantidad de recuadros.
    if (m) return Number(m[1]) >= 1 && Number(m[1]) <= MAX_GALERIA;
  }
  const slots = await getImageSlots();
  return slots.some((s) => s.id === id);
}
