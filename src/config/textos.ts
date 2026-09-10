/**
 * Catálogo de textos editables desde el panel.
 *
 * Cada campo declara su texto por defecto: es exactamente el que está escrito
 * hoy en la página. Mientras nadie edite nada, el sitio se ve igual; lo que se
 * carga en *Admin → Textos* pisa este valor.
 *
 * Para agregar un campo: sumarlo acá y usarlo en la página con
 * `const t = await getTextos("<id de la página>")` y `t("<clave>")`.
 * El panel lo toma solo, sin tocar nada más.
 */

export type TipoCampo = "linea" | "parrafo";

export interface CampoTexto {
  clave: string;
  etiqueta: string;
  tipo: TipoCampo;
  /** Aclaración de dónde se ve el texto, para quien edita. */
  ayuda?: string;
  /** Texto que se muestra si no se cargó nada en el panel. */
  valor: string;
}

export interface PaginaTextos {
  id: string;
  nombre: string;
  /** Ruta pública, para poder ir a mirar el resultado. */
  ruta: string;
  campos: CampoTexto[];
}

/** Campos que comparten todas las páginas internas (el encabezado oscuro). */
function encabezado(
  eyebrow: string,
  titulo: string,
  bajada: string
): CampoTexto[] {
  return [
    {
      clave: "hero_eyebrow",
      etiqueta: "Etiqueta del encabezado",
      tipo: "linea",
      ayuda: "La línea chica arriba del título, en mayúsculas.",
      valor: eyebrow,
    },
    {
      clave: "hero_titulo",
      etiqueta: "Título de la página",
      tipo: "linea",
      valor: titulo,
    },
    {
      clave: "hero_bajada",
      etiqueta: "Bajada del encabezado",
      tipo: "parrafo",
      ayuda: "Una o dos líneas debajo del título.",
      valor: bajada,
    },
  ];
}

export const PAGINAS_TEXTOS: PaginaTextos[] = [
  {
    id: "inicio",
    nombre: "Inicio",
    ruta: "/",
    campos: [
      {
        clave: "hero_titulo",
        etiqueta: "Título principal",
        tipo: "linea",
        ayuda: "El texto grande sobre la foto aérea.",
        valor: "Campo Escuela Flandes",
      },
      {
        clave: "hero_kicker",
        etiqueta: "Chapa blanca",
        tipo: "linea",
        ayuda: "El recuadro blanco debajo del título.",
        valor: "Campo de Ejercicios Scout",
      },
      {
        clave: "hero_bajada",
        etiqueta: "Bajada del inicio",
        tipo: "parrafo",
        valor:
          "Entidad de servicio y bien público sin fines de lucro, fundada en 1958. Acampes, formación y vida al aire libre sobre el Río Luján.",
      },
      {
        clave: "intro_titulo",
        etiqueta: "Título de la bienvenida",
        tipo: "linea",
        valor: "Un espacio pensado para el escultismo",
      },
      {
        clave: "intro_texto",
        etiqueta: "Texto de la bienvenida",
        tipo: "parrafo",
        valor:
          "Fundado en 1958 sobre un predio cedido por Algodonera Flandria a los Scouts, el campo se sostiene como entidad de bien público sin fines de lucro y se conserva y mejora de forma ininterrumpida desde entonces.",
      },
    ],
  },
  {
    id: "institucional",
    nombre: "Institucional",
    ruta: "/institucional",
    campos: [
      ...encabezado(
        "Institucional",
        "Nuestra historia",
        "Una entidad de servicio y bien público sin fines de lucro, fundada en 1958."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título de la historia",
        tipo: "linea",
        valor: "Cómo nació el campo",
      },
      {
        clave: "intro_texto",
        etiqueta: "Primer párrafo de la historia",
        tipo: "parrafo",
        ayuda: "Los párrafos siguientes no se editan desde acá.",
        valor:
          "El Campo Escuela Flandes es una entidad de servicio y bien público sin fines de lucro, fundada en 1958. El predio que ocupa fue cedido por Algodonera Flandria a los Scouts para que pudieran realizar allí sus actividades.",
      },
    ],
  },
  {
    id: "acampes",
    nombre: "Acampes",
    ruta: "/acampes",
    campos: [
      ...encabezado(
        "Acampes",
        "El predio",
        "Cuatro subcampos sobre el Río Luján, con servicios e instalaciones para tu grupo."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título de la descripción",
        tipo: "linea",
        valor: "Un predio preparado para acampar",
      },
      {
        clave: "intro_texto",
        etiqueta: "Primer párrafo de la descripción",
        tipo: "parrafo",
        ayuda: "Los párrafos siguientes no se editan desde acá.",
        valor:
          "El predio limita al Norte con el camino privado de acceso a Algodonera Flandria, cruzado de Oeste a Este por el Río Luján y bordeado por un bosque ribereño mixto natural. Al Este y al Sur limita con la calle San Martín, y al Oeste con la calle Flandes.",
      },
    ],
  },
  {
    id: "reservas",
    nombre: "Reservas",
    ruta: "/reservas",
    campos: [
      ...encabezado(
        "Reservas",
        "Reservá tu acampe",
        "Elegí subcampo y fechas, completá el formulario y coordinamos por WhatsApp."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título de las normas",
        tipo: "linea",
        valor: "Normas del acampe",
      },
      {
        clave: "intro_texto",
        etiqueta: "Bajada de las normas",
        tipo: "parrafo",
        valor: "Lo que todo grupo tiene que saber antes de llegar al campo.",
      },
    ],
  },
  {
    id: "agenda",
    nombre: "Agenda",
    ruta: "/agenda",
    campos: [
      ...encabezado(
        "Agenda",
        "Agenda del campo",
        "Acampes, cursos, charlas y actividades de los próximos meses."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título del cierre",
        tipo: "linea",
        ayuda: "La invitación a proponer actividades, al final de la página.",
        valor: "¿Querés organizar una actividad?",
      },
      {
        clave: "intro_texto",
        etiqueta: "Texto del cierre",
        tipo: "parrafo",
        valor:
          "Si tu grupo quiere proponer un curso, una charla o un encuentro en el campo, escribinos.",
      },
    ],
  },
  {
    id: "naturaleza",
    nombre: "Naturaleza",
    ruta: "/naturaleza",
    campos: [
      ...encabezado(
        "Naturaleza",
        "Flora y fauna del campo",
        "Área Forestal Protegida sobre el Río Luján, con especies señalizadas para reconocerlas."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título del entorno",
        tipo: "linea",
        valor: "Un pulmón verde sobre el Río Luján",
      },
      {
        clave: "intro_texto",
        etiqueta: "Texto del entorno",
        tipo: "parrafo",
        valor:
          "El predio está bordeado por un bosque ribereño mixto natural y fue forestado en distintas etapas, lo que permite diferenciar varios ambientes. Por la tranquilidad del lugar y la abundante vegetación se observa allí una gran cantidad de animales, entre los que predominan las aves.",
      },
    ],
  },
  {
    id: "biblioteca",
    nombre: "Biblioteca",
    ruta: "/biblioteca",
    campos: [
      ...encabezado(
        "Biblioteca",
        "Biblioteca del campo",
        "El Bordón digital, material para descargar y libros para consultar en el predio."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título del Bordón",
        tipo: "linea",
        valor: "Las ediciones del Bordón",
      },
      {
        clave: "intro_texto",
        etiqueta: "Bajada del Bordón",
        tipo: "parrafo",
        valor: "El boletín del campo, en video. Se abren en el canal de YouTube.",
      },
    ],
  },
  {
    id: "libreria",
    nombre: "Librería",
    ruta: "/libreria",
    campos: [
      ...encabezado(
        "Librería",
        "Librería del campo",
        "Material scout, guías de naturaleza y libros de formación."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título del catálogo",
        tipo: "linea",
        valor: "Libros disponibles",
      },
      {
        clave: "intro_texto",
        etiqueta: "Bajada del catálogo",
        tipo: "parrafo",
        valor: "El catálogo se actualiza desde el panel del campo.",
      },
    ],
  },
  {
    id: "adiestramiento",
    nombre: "Adiestramiento",
    ruta: "/adiestramiento",
    campos: [
      ...encabezado(
        "Adiestramiento",
        "Adiestramiento",
        "Cursos, charlas y videos de formación para dirigentes y scouts."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título de los cursos",
        tipo: "linea",
        valor: "Próximos cursos",
      },
      {
        clave: "intro_texto",
        etiqueta: "Bajada de los cursos",
        tipo: "parrafo",
        valor: "Inscribite por WhatsApp desde cada curso.",
      },
    ],
  },
  {
    id: "contacto",
    nombre: "Contacto",
    ruta: "/contacto",
    campos: [
      ...encabezado(
        "Contacto",
        "Contacto",
        "Escribinos por WhatsApp, por correo o con el formulario."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título del formulario",
        tipo: "linea",
        valor: "Escribinos",
      },
      {
        clave: "intro_texto",
        etiqueta: "Bajada del formulario",
        tipo: "parrafo",
        valor: "Completá el formulario y te respondemos por WhatsApp.",
      },
    ],
  },
  {
    id: "socios",
    nombre: "Socios",
    ruta: "/socios",
    campos: [
      ...encabezado(
        "Socios",
        "Hacete socio",
        "Sostené el campo y accedé al material exclusivo del portal de socios."
      ),
      {
        clave: "intro_titulo",
        etiqueta: "Título de la explicación",
        tipo: "linea",
        valor: "Qué significa ser socio del campo",
      },
      {
        clave: "intro_texto",
        etiqueta: "Texto de la explicación",
        tipo: "parrafo",
        valor:
          "Acá va la explicación de qué implica asociarse: en qué se usa la cuota, qué sostiene y por qué es importante para el campo.",
      },
    ],
  },
];

/** La clave con la que se guarda un campo: "acampes.hero_titulo". */
export function claveTexto(paginaId: string, clave: string): string {
  return `${paginaId}.${clave}`;
}

/** Todos los textos por defecto, aplanados por clave completa. */
export const TEXTOS_POR_DEFECTO: Record<string, string> = Object.fromEntries(
  PAGINAS_TEXTOS.flatMap((p) =>
    p.campos.map((c) => [claveTexto(p.id, c.clave), c.valor])
  )
);
