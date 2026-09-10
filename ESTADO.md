# Estado del proyecto — Campo Escuela Flandes

Documento de traspaso. Última actualización: agosto 2026.

---

## Dónde está

- **Repositorio:** github.com/woinivincent/campo-escuela-flandes (público)
- **Hosting:** Netlify. El push a `main` dispara el despliegue.
- **Almacenamiento:** Netlify Blobs. No hay base de datos.

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

## Arquitectura: cinco cosas que no son obvias

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

### 3. Los valores por defecto de configuración están escritos dos veces

Están en `src/config/site.ts` **y** en `SEED_CONFIG` (`src/lib/db.ts`), y gana el
segundo: `readConfig` mergea los defaults del seed, y después el `pick()` de
`siteConfigService` ve un valor no vacío y nunca llega al de `site.ts`. Si
cambiás un default y el sitio no se inmuta, es esto: hay que tocar los dos.

### 4. Los textos de las páginas: el código manda como respaldo

Los textos por defecto viven en `src/config/textos.ts`, no en el JSX. El panel
guarda **solo lo que alguien editó**, así que cambiar un texto en el código se ve
enseguida en todos los campos que nadie tocó, y si el almacenamiento se cae el
sitio sigue mostrando los textos del código en vez de quedar en blanco.

Para sumar un campo editable: agregarlo al catálogo y usarlo en la página con
`const t = await getTextos("<página>")` y `t("<clave>")`. El panel lo toma solo.

### 5. Las imágenes no se cachean como fijas

Se sirven con `max-age=0, must-revalidate`. Estuvieron con `immutable` un año y
eso hacía que reemplazar o quitar una foto no se viera nunca.

---

## Entorno de desarrollo: dos trampas

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
- **Textos editables** (`/admin/textos`): los títulos y textos principales de las
  11 páginas públicas, 5 campos cada una. Cada página se guarda por separado.
  Un campo vacío muestra el texto original, que aparece en gris como referencia.

**Contenido real cargado:** historia (fundación en 1958, predio cedido por
Algodonera Flandria), los cuatro objetivos institucionales, límites del predio,
Área Forestal Protegida, 16 fotos y las 30 tapas de la biblioteca.

**Especies:** 11 fichas con descripción y curiosidad, escritas para un chico que
escanea el QR parado frente a la especie. 6 de flora (araucaria, roble, ceibo,
sauce criollo, tala, espinillo) y 5 de fauna (carpincho, coipo, lobito de río,
hornero, martín pescador). Entraron solo las que tienen respaldo documental; las
dudosas están listadas más abajo. Los datos salen de las fuentes de la UNLu, la
redacción es propia.

---

## Qué falta

### Decisiones del campo

- **El dominio definitivo.** Condiciona la impresión de los carteles con QR: si
  cambia después, hay que reimprimirlos.

  ⚠️ **Hoy el campo no tiene ninguna dirección web que funcione.** Se
  verificaron las dos candidatas:

  - `campoescuelaflandes.netlify.app` (el default de `site_url` en el código):
    Netlify responde 404, no hay ningún sitio reclamado en ese subdominio.
  - `www.campoescuelaflandes.com` (el que el campo imprime en la foto de
    portada de su Facebook, y que figura como `website` en `src/config/site.ts`):
    **el dominio no está registrado.** NXDOMAIN confirmado contra los resolvers
    de Cloudflare y de Google.

  O sea que la portada del Facebook manda a la gente a un dominio que no existe,
  y que ese nombre lo puede registrar cualquiera. Conviene avisarle al campo y
  decidir si lo registran.

  Para los QR: cargar la URL real en *Admin → Config*, regenerar y escanear uno
  antes de mandar nada a imprenta.
- Capacidades reales de cada subcampo (hoy son valores de ejemplo).
- Hectáreas del predio y valor de la cuota de socios.

### Contenido que falta

- **Portadas**: solo está la de Acampes. Faltan las otras 9 y la del inicio.
- **Fotos de subcampos** (4) y de **flora**: las carpetas del Drive están vacías.
  Las 11 fichas de especies ya tienen texto, pero ninguna tiene foto todavía.
- **Fauna**: hay 23 fotos, pero con nombres tipo `076ff466-d309…`. Hay que
  identificar qué especie es cada una.
- **Títulos del Bordón**: los seis videos figuran como "Capítulo N". Las
  miniaturas muestran un hornero y una liebre, así que son sobre fauna del campo.
- Textos de Acampes y Reservas: normas del acampe, costos y descripciones.

### Especies: a confirmar con el campo

El catálogo de Naturaleza se cargó con las especies que tienen respaldo: el
plano del predio, el censo forestal de Tuis en el campo y el relevamiento de
fauna del Río Luján. Estas quedaron afuera o con dudas:

| Especie | Qué falta resolver |
|---|---|
| Álamo plateado, ligustro, árbol del cielo | El censo los encontró en el campo, pero no están en la enciclopedia del Jardín Botánico. Hay que buscar los datos en otra fuente. |
| Eucalipto | El plano lo nombra sin decir la especie. Hay cuatro en la enciclopedia; hace falta ver un ejemplar para saber cuál es. |
| Laurel | El censo dice "laurel" a secas. Puede ser el laurel criollo (*Nectandra angustifolia*, nativo de ribera) o el de cocina (*Laurus nobilis*, exótico de parque). Son árboles distintos. |
| Espinillo, martín pescador | Ya estaban cargados y se les escribió la ficha, pero no aparecen en ninguna fuente del predio. Si el campo dice que no están, se borran desde *Admin → Naturaleza*. |
| Liebre europea | Se ve en la miniatura de un capítulo del Bordón, así que alguien la filmó en el campo. Falta confirmar que sea del predio. |

**Ojo con los nombres científicos.** El atlas del SIAI publica "Chimango —
*Parabuteo unicinctus*", que es el nombre del gavilán mixto; el chimango es
*Milvago chimango*. Estos nombres van impresos en los carteles con QR, así que
conviene chequear cada uno contra una segunda fuente antes de cargarlo.

### Funciones pedidas, sin empezar

| Ítem | Nota |
|---|---|
| WhatsApp por área | Números propios para formaciones, biblioteca y responsable de socios |
| Importar padrón de socios | Desde planilla Excel |
| Responsable de socios | Nombre y contacto; definir si se muestra público |
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
