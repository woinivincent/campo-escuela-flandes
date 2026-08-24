# Estado del proyecto — Campo Escuela Flandes

Documento de traspaso. Última actualización: agosto 2026.

---

## Dónde está

- **Repositorio:** github.com/woinivincent/campo-escuela-flandes (público)
- **Hosting:** Netlify. El push a `main` dispara el despliegue.
- **Almacenamiento:** Netlify Blobs. No hay base de datos.

---

## ⚠️ Pendiente urgente: el panel está abierto

`ADMIN_PASSWORD` **no está configurada en Netlify**, así que vale la contraseña
por defecto que está en el código — y el repositorio es público. Cualquiera que
la lea puede entrar a editar o borrar el contenido del sitio.

**Cómo cerrarlo:** en Netlify → *Site configuration → Environment variables* →
agregar `ADMIN_PASSWORD` con una contraseña nueva → *Deploys → Trigger deploy*.

Después de eso conviene quitar del código el valor por defecto de
`src/lib/auth.ts`, para que sin la variable no deje entrar en vez de caer en una
clave conocida.

**Relacionado:** el socio de prueba `demo@campoflandes.org.ar` tiene su clave en
el repositorio. Borrarlo desde *Admin → Socios* antes de difundir el sitio.

**Fuera del sitio:** en `asociacioncivilcampoclubscouts.blogspot.com` hay
publicada un acta con nombres, DNI y firmas de la comisión directiva. Conviene
avisarle al campo.

---

## Arquitectura: tres cosas que no son obvias

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

### 3. Las imágenes no se cachean como fijas

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

**Contenido real cargado:** historia (fundación en 1958, predio cedido por
Algodonera Flandria), los cuatro objetivos institucionales, límites del predio,
Área Forestal Protegida, 16 fotos y las 30 tapas de la biblioteca.

---

## Qué falta

### Decisiones del campo

- **El dominio definitivo.** Condiciona la impresión de los carteles con QR: si
  cambia después, hay que reimprimirlos.
- Capacidades reales de cada subcampo (hoy son valores de ejemplo).
- Hectáreas del predio y valor de la cuota de socios.

### Contenido que falta

- **Portadas**: solo está la de Acampes. Faltan las otras 9 y la del inicio.
- **Fotos de subcampos** (4) y de **flora**: las carpetas del Drive están vacías.
- **Fauna**: hay 23 fotos, pero con nombres tipo `076ff466-d309…`. Hay que
  identificar qué especie es cada una.
- **Títulos del Bordón**: los seis videos figuran como "Capítulo N". Las
  miniaturas muestran un hornero y una liebre, así que son sobre fauna del campo.
- Textos de Acampes y Reservas: normas del acampe, costos y descripciones.

### Funciones pedidas, sin empezar

| Ítem | Nota |
|---|---|
| Textos editables desde el panel | El más grande. Alcance acordado: títulos y textos principales, ~5 campos por página |
| WhatsApp por área | Números propios para formaciones, biblioteca y responsable de socios |
| Importar padrón de socios | Desde planilla Excel |
| Responsable de socios | Nombre y contacto; definir si se muestra público |
| Logo | Está el original recortado del cartel. Si aparece el archivo en mejor calidad, reemplazar `public/seed-images/logo-flandes.png` |

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

**Carpeta de fotos en Drive** (compartida, organizada como los espacios del sitio):
Portadas, Secciones, Subcampos, Flora, Fauna, Libros y Galería.

Truco útil: las fotos en formato HEIC no se pueden usar directamente, pero Drive
las entrega ya convertidas a JPEG con
`https://drive.google.com/thumbnail?id=<ID>&sz=w1200`.

**Derechos:** ocho de los libros del catálogo los publica el propio campo
—entre ellos *Árboles del Campo Escuela Flandes*—, así que puede publicarlos
completos. El resto son de terceros: conviene enlazar, no alojar.
