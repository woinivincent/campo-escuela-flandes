import { cache } from "react";
import { getAllTextos } from "@/lib/db";
import { TEXTOS_POR_DEFECTO, claveTexto } from "@/config/textos";

/** Devuelve el texto de un campo de la página actual. */
export type Textos = (clave: string) => string;

/**
 * Una sola lectura del store por request, aunque la pidan el layout y la
 * página por separado. Mismo criterio que `getSiteSettings`.
 */
const leerTextos = cache(async () => getAllTextos());

/**
 * Textos de una página, listos para usar dentro del JSX.
 *
 *   const t = await getTextos("acampes");
 *   <PageHero title={t("hero_titulo")} />
 *
 * Si el campo está vacío o nunca se editó, cae en el texto por defecto del
 * catálogo. Un campo vacío en el panel es, entonces, "volver al original".
 */
export async function getTextos(paginaId: string): Promise<Textos> {
  const guardados = await leerTextos();

  return (clave: string) => {
    const k = claveTexto(paginaId, clave);
    const guardado = guardados[k];
    if (guardado && guardado.trim() !== "") return guardado;
    return TEXTOS_POR_DEFECTO[k] ?? "";
  };
}
