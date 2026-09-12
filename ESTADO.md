# Estado del proyecto — Campo Escuela Flandes

Documento de traspaso. Última actualización: agosto 2026.

---

## Dónde está

- **Sitio publicado:** https://campoescuelaflandes.org (también responde en
  `flandes.netlify.app`)
- **Repositorio:** github.com/woinivincent/campo-escuela-flandes (público)
- **Hosting:** Netlify. El push a `main` dispara el despliegue.
- **Almacenamiento:** Netlify Blobs. No hay base de datos.
- **Framework:** Next 16. Se actualizó desde 15.5.19 porque toda la línea 15.x
  arrastraba una advertencia crítica: RCE no autenticada en la Image
  Optimization API con archivos AVIF, entre otras nueve.

---

## ⚠️ Pendiente urgente: cargar la contraseña en Netlify

El código ya no tiene clave por defecto. Sin `ADMIN_PASSWORD` el panel no deja
entrar a nadie —antes caía en una clave que estaba a la vista en el repositorio,
que es público— y la pantalla de acceso avisa que falta configurarla.

El costo es que, mientras la variable no esté cargada, **tampoco puede entrar el
campo**.

**Qué hacer:** en Netlify → *Site configuration → Environment variables* →
agregar `ADMIN_PASSWORD` con una contraseña nueva → *Deploys → Trigger deploy*.

En desarrollo: copiar `.env.example` a `.env.local` y poner cualquier clave.

**Relacionado:** el socio de prueba `demo@campoflandes.org.ar` ya no está en el
código. **Igual hay que mirar *Admin → Socios* en el sitio publicado:** si alguna
vez se guardó el padrón, la fila quedó escrita en Blobs y sigue ahí. Si la lista
aparece vacía, no hay nada que borrar.

**Fuera del sitio:** en `asociacioncivilcampoclubscouts.blogspot.com` hay
publicada un acta con nombres, DNI y firmas de la comisión directiva. Conviene
avisarle al campo.

---

## Arquitectura: siete cosas que no son obvias

### 1. Nunca usar `process.env.NETLIFY` para detectar el entorno

Existe durante el build pero **no en tiempo de ejecución** dentro de las
funciones. Confiar en ella hacía que en producción se intentara escribir en un
filesystem de solo lectura: error 500 en cada guardado. La detección correcta es
intentar abrir el store y ver si responde (`src/lib/blobs.ts`).

### 2. Las imágenes y documentos siempre pasan por su API route

En `next.config.ts` los rewrites de `/images/*` y `/docs/*` están en
`beforeFiles`. Si estuvieran en `afterFiles`, un archivo en `public/` taparía lo
que se sube desde el panel y el cambio no se vería nunca.

Orden de resolución de una imagen:

1. Netlify Blobs — lo subido desde el panel, siempre gana
2. `public/images` — subidas locales en desarrollo
3. `public/seed-images` — fotos versionadas en el repo, como respaldo

### 3. Lo guardado le gana al código, para siempre

Una vez que una colección se guardó desde el panel, `readCollection` devuelve
**eso** y el seed del código no se ve nunca más. Es lo que hace que el panel
mande, pero tiene una consecuencia que ya mordió: se pueden escribir fichas
nuevas en el código, verlas perfectas en local, pushear, y que producción siga
mostrando lo viejo.

Pasó con las especies: en Blobs había un catálogo de maqueta con textos
*Lorem ipsum*, así que las 11 fichas reales del código eran invisibles en el
sitio publicado.

**Dónde mirarlo:** `/admin/diagnostico` → *El código contra lo guardado*. Dice,
colección por colección, si manda lo guardado o el código, y tiene un botón
**Volcar el código** que pisa lo guardado con lo del repositorio. Es destructivo:
borra lo que se haya cargado desde el panel en esa colección.

La configuración se muestra ahí también, pero **no se toca sola**: son valores
reales del campo (el WhatsApp, por ejemplo) y hay que corregirlos a mano.

### 4. Las sesiones son un token guardado, no un dato en la cookie

La cookie lleva un token aleatorio de 256 bits que no significa nada por sí
mismo: solo vale si está en el mapa `sesiones` del almacén, que es lo único
que sabe a quién corresponde y hasta cuándo.

Antes no era así y el panel estaba abierto: la cookie era `flandes_admin=1`, un
valor fijo. Cualquiera que escribiera esa cookie a mano entraba al panel
completo sin conocer la contraseña. En el portal de socios era parecido pero
con un paso más: la cookie llevaba el id del socio, y los ids se arman con la
marca de tiempo del alta, así que se podían probar marcas cercanas.

Se eligió un token guardado y no una cookie firmada para no depender de un
secreto nuevo en el entorno: si esa variable faltara o cambiara entre
despliegues, las sesiones se romperían en silencio.

Dos consecuencias prácticas: cerrar sesión ahora invalida el token del lado del
servidor, y si el almacenamiento no responde no valida ninguna sesión —que para
autenticación es el lado correcto en el que fallar—.

El middleware corre en el Edge y no llega al almacén, así que solo mira si hay
cookie. La validación de verdad la hacen `requireAuth()` y `getSocioSession()`,
que corren en Node. Por eso importa que **todas** las páginas y acciones del
panel llamen a `requireAuth()`, no solo el middleware.

### 5. Los valores por defecto de configuración están escritos dos veces

Están en `src/config/site.ts` **y** en `SEED_CONFIG` (`src/lib/db.ts`), y gana el
segundo: `readConfig` mergea los defaults del seed, y después el `pick()` de
`siteConfigService` ve un valor no vacío y nunca llega al de `site.ts`. Si
cambiás un default y el sitio no se inmuta, es esto: hay que tocar los dos.

### 6. Los textos de las páginas: el código manda como respaldo

Los textos por defecto viven en `src/config/textos.ts`, no en el JSX. El panel
guarda **solo lo que alguien editó**, así que cambiar un texto en el código se ve
enseguida en todos los campos que nadie tocó, y si el almacenamiento se cae el
sitio sigue mostrando los textos del código en vez de quedar en blanco.

Para sumar un campo editable: agregarlo al catálogo y usarlo en la página con
`const t = await getTextos("<página>")` y `t("<clave>")`. El panel lo toma solo.

### 7. Las imágenes no se cachean como fijas

Se sirven con `max-age=0, must-revalidate`. Estuvieron con `immutable` un año y
eso hacía que reemplazar o quitar una foto no se viera nunca.

---

## Entorno de desarrollo: tres trampas

**El archivo de rutas protegidas es `src/proxy.ts`, no `middleware.ts`.** Next 16
renombró la convención; la vieja sigue andando pero avisa que está obsoleta. Es
el primer lugar donde mirar si `/admin` o `/socios/portal` dejan de redirigir.

**No correr `npm run build` con el servidor de desarrollo levantado.** El build
de producción pisa los chunks de `.next` y el sitio local empieza a tirar
`__webpack_modules__ is not a function` o `Cannot find module './331.js'`. Si
pasa: parar el servidor, `rm -rf .next`, arrancar de nuevo.

**El Python de esta máquina está roto.** Le faltan módulos de la biblioteca
estándar (`pip`, `xml.etree`, `numbers`, `idna`), así que falla al resolver
dominios, leer XML o procesar imágenes con PIL. Para esas tareas usar **Node con
`sharp`** y **curl**, que funcionan bien.

---

## Qué está hecho

**14 páginas públicas** y **15 paneles de administración**. Todo el contenido se
administra sin tocar código: agenda, librería, cursos, hitos, especies, socios,
biblioteca, imágenes y configuración.

Destacados:

- **Mapa del predio**: ilustración interactiva en SVG con los cuatro subcampos.
  Al tocar uno se abre su ficha. Los nombres reales salieron del plano del campo:
  Santa Clara de Asís, Ntra. Sra. de Luján, San Jorge y San Francisco de Asís.
- **Códigos QR**: cada especie tiene el suyo, con descarga y planilla imprimible.
  Apuntan a `site_url`, configurable desde el panel.
- **Biblioteca**: el Bordón digital (videos), material descargable y el catálogo
  de 30 libros con sus tapas.
- **Portal de socios**: acceso con contraseña, separado del panel.
- **Diagnóstico** (`/admin/diagnostico`): dice si el almacenamiento responde y
  muestra el error exacto si falla. Es el primer lugar donde mirar si algo no guarda.
- **WhatsApp por área y responsable de socios** (*Admin → Config*): Formaciones,
  Biblioteca y Socios pueden tener su propio número; el que quede vacío usa el
  general, así que el sitio se comporta igual que antes hasta que carguen algo.
  El responsable de socios tiene nombre, contacto y un interruptor para
  publicarlo: sin nombre, o sin tildar, no aparece nada en la página de Socios.
  **Faltan los números y los datos del responsable**, que el campo no pasó todavía.
- **Importar padrón** (*Admin → Socios → Importar padrón*): sube un CSV, adivina
  qué columna es el nombre y cuál el email, muestra una vista previa con el
  motivo de cada fila que queda afuera, y da de alta el resto en una sola
  escritura, de a tandas de ocho filas. A cada socio le genera una clave inicial que se muestra **una sola
  vez**, en una tabla que se puede copiar. Desde Excel: *Guardar como → CSV UTF-8*.
- **SEO técnico**: `robots.txt`, `sitemap.xml` con las secciones y las 23 fichas,
  URL canónica por página, etiquetas para redes y datos estructurados de la
  organización que la vinculan con Facebook e Instagram. El panel lleva
  `noindex`. La URL oficial vive en `URL_SITIO` (`src/config/site.ts`), fuera del
  panel a propósito: estos archivos se generan sin acceso al almacén.
- **Textos editables** (`/admin/textos`): los títulos y textos principales de las
  11 páginas públicas, 5 campos cada una. Cada página se guarda por separado.
  Un campo vacío muestra el texto original, que aparece en gris como referencia.

**Contenido real cargado:** historia (fundación en 1958, predio cedido por
Algodonera Flandria), los cuatro objetivos institucionales, límites del predio,
Área Forestal Protegida, 16 fotos y las 30 tapas de la biblioteca.

**Fotos:** todas las portadas de sección y las 11 fichas de especies tienen
imagen. Las portadas salen de fotos del propio campo que ya estaban en el
repositorio. Las de especies y la portada de Naturaleza vienen de Wikimedia
Commons, **con licencias que exigen atribución**: los créditos viven en
`src/config/creditosFotos.ts` y se muestran al pie de cada foto. Si se borra el
crédito se incumple la licencia. Cuando el campo aporte su propia foto de una
especie, se sube desde *Admin → Imágenes* —que le gana al repositorio— y se
saca esa entrada del archivo de créditos.

**Especies:** 23 fichas con descripción y curiosidad, escritas para un chico que
escanea el QR parado frente a la especie. 6 de flora (araucaria, roble, ceibo,
12 de flora y 11 de fauna. Entraron solo las que tienen respaldo documental —el
plano del predio, el censo forestal, el relevamiento del Río Luján y los seis
capítulos del Bordón—; las dudosas siguen listadas más abajo. Los datos salen de las fuentes de la UNLu, la
redacción es propia.

---

## Qué falta

### Decisiones del campo

- **El dominio definitivo.** Condiciona la impresión de los carteles con QR: si
  cambia después, hay que reimprimirlos.

  El sitio está publicado en **https://campoescuelaflandes.org** (y también
  responde en `flandes.netlify.app`). Ese es el dominio bueno y ya quedó
  cargado como valor por defecto de `site_url`.

  ⚠️ Pero **`campoescuelaflandes.com`, que el campo imprime en la foto de
  portada de su Facebook, no está registrado** (NXDOMAIN, verificado contra
  Cloudflare y Google). O sea que la portada manda a la gente a un dominio que
  no existe, y ese nombre lo puede registrar cualquiera. Conviene corregir la
  portada, o registrar el `.com` y redirigirlo al `.org`.

  Para los QR: confirmar que *Admin → Config* tenga el `.org` cargado,
  regenerar y escanear uno antes de mandar nada a imprenta.
- **Qué hacer con `campoescuelaflandes.net`.** Existe otro sitio del campo, un
  WordPress con última publicación en mayo de 2023, que es el que aparece en
  Google. Mientras los dos convivan compiten entre sí por las mismas búsquedas,
  y el `.net` gana porque tiene años de antigüedad y enlaces. Lo recomendable es
  que el `.net` redirija con 301 al `.org`: transfiere la mayor parte de su
  posicionamiento en vez de tirarlo. Eso lo tiene que hacer quien administre el
  `.net`, desde su hosting.

  Para que el `.org` gane lugar, además: darlo de alta en Google Search Console y
  enviar el sitemap; cambiar el enlace "Sitio web" de la ficha de Google Maps; y
  actualizar los enlaces de Facebook, Instagram y Linktree. Son los sitios que
  Google ya asocia al campo, y hoy ninguno apunta al `.org`.
- Capacidades reales de cada subcampo (hoy son valores de ejemplo).
- Hectáreas del predio y valor de la cuota de socios.

### Contenido que falta

- **Fotos de subcampos** (4) y de la bienvenida del inicio: están puestas, pero
  son **provisorias**. Se revisó el blog del campo primero: de sus 453 imágenes,
  casi todas son de obras y arreglos —baños, matafuegos, cañerías—, y las dos
  únicas con arboleda servible tenían basura en primer plano o venían en 225
  píxeles. Así que se reutilizaron fotos del propio campo que ya estaban en el
  repositorio, con recortes distintos. En cuanto aparezcan las del Drive, se
  suben desde *Admin → Imágenes* y tapan a estas.
- **Fauna**: hay 23 fotos en el Drive, con nombres tipo `076ff466-d309…`. Hay
  que identificar qué especie es cada una. Servirían para reemplazar las de
  Commons por fotos del propio campo.
- **Normas del acampe**: quedan dos sin escribir, **uso del fuego** y
  **horarios de ingreso, silencio y salida**. El campo nunca las publicó, así
  que hay que preguntárselas. Las otras cuatro salieron del blog.
- **Costos de estadía y cuota de socios**: el blog los publicó en 2011, 2014 y
  2019, pero todos están desactualizados. Hay que pedir los vigentes.
- **Descripciones de los cuatro subcampos** en Reservas.
- **Beneficios de socios**: quedan dos genéricos y el detalle de qué incluye la cuota.

### De dónde salieron las 12 especies del Bordón

Los seis capítulos del Bordón presentan **un árbol y un animal por capítulo**, y
son del predio: los filmó el área de Adiestramiento del campo. **Ya están
cargadas las doce**, con foto y ficha:

| Capítulo | Árbol | Animal |
|---|---|---|
| 1 | Ciprés calvo | Liebre |
| 2 | Ciprés Arizona | Zorzal colorado |
| 3 | Casuarina | Carpintero real |
| 4 | Pino Elliotti | Ratucha |
| 5 | Árbol del cielo | Lechuza de campanario |
| 6 | Ciprés piramidal | Torcacita |

Esto resolvió dos de las dudas de abajo: el **árbol del cielo** y la **liebre**
quedaron confirmados en el predio, y por eso están cargados.

"Ratucha" no era un roedor: la descripción del capítulo 4 dice "una de las aves
más pequeña y movediza que habita el campo". Es la **ratona común**
(*Troglodytes aedon*), que en Buenos Aires se llama así.

### Especies: a confirmar con el campo

El catálogo de Naturaleza se cargó con las especies que tienen respaldo: el
plano del predio, el censo forestal de Tuis en el campo y el relevamiento de
fauna del Río Luján. Estas quedaron afuera o con dudas:

| Especie | Qué falta resolver |
|---|---|
| Álamo plateado, ligustro | El censo los encontró en el campo, pero no están en la enciclopedia del Jardín Botánico. Hay que buscar los datos en otra fuente. |
| Eucalipto | El plano lo nombra sin decir la especie. Hay cuatro en la enciclopedia; hace falta ver un ejemplar para saber cuál es. |
| Laurel | El censo dice "laurel" a secas. Puede ser el laurel criollo (*Nectandra angustifolia*, nativo de ribera) o el de cocina (*Laurus nobilis*, exótico de parque). Son árboles distintos. |
| Espinillo, martín pescador | Ya estaban cargados y se les escribió la ficha, pero no aparecen en ninguna fuente del predio. Si el campo dice que no están, se borran desde *Admin → Naturaleza*. |

**Ojo con los nombres científicos.** El atlas del SIAI publica "Chimango —
*Parabuteo unicinctus*", que es el nombre del gavilán mixto; el chimango es
*Milvago chimango*. Estos nombres van impresos en los carteles con QR, así que
conviene chequear cada uno contra una segunda fuente antes de cargarlo.

### Funciones pedidas, sin empezar

| Ítem | Nota |
|---|---|
| Logo | Está el original recortado del cartel (400×536). El del Facebook es de 200×200, así que no sirve. Si aparece el archivo en mejor calidad, reemplazar `public/seed-images/logo-flandes.png` |

---

## Material del campo en internet

El campo tiene una red de blogs, todos públicos:

- `campoescuelaflandes.blogspot.com` — el principal
- `historiadelcampo.blogspot.com` — la historia (ya volcada al sitio)
- `fotoscampoflandes.blogspot.com` — fotos, incluidas varias de 1957
- `bordondigital.blogspot.com` — el Bordón
- `temasdeadiestramiento.blogspot.com` — 27 documentos de formación,
  **todos con el enlace roto**: los archivos se borraron del Drive
- `asociacioncivilcampoclubscouts.blogspot.com` — ⚠️ ver la advertencia de arriba

**Redes del campo** (verificadas y ya cargadas como valor por defecto):

- Facebook: `facebook.com/Campo.Escuela.Flande`. Ojo: **es un perfil personal, no
  una página.** Tiene 3 mil amigos, y los perfiles topean en 5 mil. Para una
  institución convendría una página, que además da estadísticas y varios
  administradores.
- Instagram: `instagram.com/campoescuela`.
- La ubicación real es Jáuregui, Buenos Aires (antes decía "Provincia de Buenos
  Aires" a secas).

Sus 8 álbumes son de eventos y servicios al campo entre 2008 y 2014: **no hay
álbum de flora ni de fauna.**

Se probaron las dos imágenes que parecían aprovechables y **ninguna sirvió**:

- **La foto de portada** (aérea del predio en otoño) tiene el título del campo y
  la dirección `www.campoescuelaflandes.com` **quemados en la imagen**. Puesta
  como fondo del inicio, el título del sitio se superpone al de la foto y se lee
  doble; además publicaría el dominio que no existe. Lo que hay que pedirle al
  campo es **la aérea original, sin el texto encima**.
- **La foto de perfil** es de 200×200. El logo que ya está en el repo es de
  400×536, así que sería un downgrade. No se tocó.

Entre los contactos figura **Danilo Tuissi**: casi seguro es el "Tuis" del censo
forestal del campo que cita la UNLu. Es el camino para conseguir los datos del
censo, que el atlas menciona pero no publica.

**Fuentes de la UNLu** (se usaron para las fichas de especies):

- `jardinbotanico.unlu.edu.ar/enciclopedia/index.php` — 248 fichas de plantas con
  datos botánicos completos. Ojo: sin `index.php` la URL da 404.
- `siai-lujan.unlu.edu.ar/atlas/fisico_natural/medio_natural/` — flora y fauna del
  partido. La página de flora menciona el censo de Tuis hecho en el campo.
- Guichón et al. 2007, *Ecología Austral* 17:81-90 — fauna ribereña del Río Luján.
  Registró coipo, carpincho y lobito de río.

**Carpeta de fotos en Drive** (compartida, organizada como los espacios del sitio):
Portadas, Secciones, Subcampos, Flora, Fauna, Libros y Galería.

Truco útil: las fotos en formato HEIC no se pueden usar directamente, pero Drive
las entrega ya convertidas a JPEG con
`https://drive.google.com/thumbnail?id=<ID>&sz=w1200`.

**Derechos:** ocho de los libros del catálogo los publica el propio campo
—entre ellos *Árboles del Campo Escuela Flandes*—, así que puede publicarlos
completos. El resto son de terceros: conviene enlazar, no alojar.
