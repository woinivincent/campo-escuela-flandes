/**
 * Créditos de las fotos que no son del campo.
 *
 * Las de flora salieron de Wikimedia Commons, donde las licencias permiten
 * reutilizarlas **con atribución**: por eso están acá y por eso la ficha las
 * muestra al pie de la foto. Si se borra el crédito, se incumple la licencia.
 *
 * Cuando el campo aporte su propia foto de una especie, se sube desde
 * *Admin → Imágenes* —que le gana a la del repositorio— y se saca la entrada
 * de este archivo.
 */

export interface CreditoFoto {
  autor: string;
  licencia: string;
  /** Página de origen, para poder llegar a la obra y a su licencia. */
  pagina: string;
}

/** Clave: el id de la especie, el mismo de `especie-<id>.jpg`. */
export const CREDITOS_ESPECIES: Record<string, CreditoFoto> = {
  araucaria: {
    autor: "Germano Roberto Schüür",
    licencia: "CC BY-SA 3.0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:Itaimbezinho_-_Parque_Nacional_Aparados_da_Serra_33.JPG",
  },
  roble: {
    autor: "Stefanst",
    licencia: "CC BY 2.5",
    pagina:
      "https://commons.wikimedia.org/wiki/File:Crooked_branches_of_Quercus_robur.jpg",
  },
  ceibo: {
    autor: "O Tupinólogo",
    licencia: "CC BY 4.0",
    pagina: "https://commons.wikimedia.org/wiki/File:Corticeira_em_Bag%C3%A9_04.jpg",
  },
  sauce: {
    autor: "Aeveraal",
    licencia: "CC BY-SA 4.0",
    pagina: "https://commons.wikimedia.org/wiki/File:Sauce_amargo.jpg",
  },
  tala: {
    autor: "Arianza1",
    licencia: "CC BY-SA 4.0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:Celtis_ehrenbergiana_arbol.jpg",
  },
  espinillo: {
    autor: "Penarc",
    licencia: "Dominio público",
    pagina: "https://commons.wikimedia.org/wiki/File:Acaciacaven29.jpg",
  },

  // Fauna
  carpincho: {
    autor: "Wilfredor",
    licencia: "CC0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:Hydrochoeris_hydrochaeris_in_Brazil_in_Petr%C3%B3polis%2C_Rio_de_Janeiro%2C_Brazil_09.jpg",
  },
  coipo: {
    autor: "Philippe Amelant",
    licencia: "CC BY-SA 3.0",
    pagina: "https://commons.wikimedia.org/wiki/File:Myocastor_coypus_-_ragondin.jpg",
  },
  "lobito-de-rio": {
    autor: "Carla Antonini",
    licencia: "CC BY-SA 2.5 AR",
    pagina: "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_4.jpeg",
  },
  hornero: {
    autor: "Dario Sanches",
    licencia: "CC BY-SA 2.0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:Flickr_-_Dario_Sanches_-_JO%C3%83O-DE-BARRO_(Furnarius_rufus)_(3).jpg",
  },
  "martin-pescador": {
    autor: "Dario Sanches",
    licencia: "CC BY-SA 2.0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:MARTIM-PESCADOR-GRANDE_(Megaceryle_torquata).jpg",
  },
};

/**
 * Portadas de sección que no son del campo.
 *
 * Las demás portadas salen de fotos del propio predio que ya estaban en el
 * repositorio, así que no llevan crédito. La única de afuera es la de
 * Naturaleza: muestra el Río Luján a la altura de Jáuregui, al lado del campo.
 */
export const CREDITOS_PORTADAS: Record<string, CreditoFoto> = {
  "naturaleza-portada": {
    autor: "Roberto Fiadone",
    licencia: "CC BY-SA 4.0",
    pagina:
      "https://commons.wikimedia.org/wiki/File:R%C3%ADo_Luj%C3%A1n_Jos%C3%A9_Mar%C3%ADa_J%C3%A1uregui.jpg",
  },
};
