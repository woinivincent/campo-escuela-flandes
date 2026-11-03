# Redirección 301 de `campoescuelaflandes.net` → `campoescuelaflandes.org`

Esto **no se hace desde este repositorio**. El `.net` es otro sitio, en otro
hosting, y la redirección se configura allá.

## Dónde está el sitio viejo

- **Dominio:** `campoescuelaflandes.net`
- **Hosting:** Hostinger (hPanel)
- **Software:** WordPress 6.6.10
- **Estado:** vivo y respondiendo 200

## Por qué conviene hacerlo

Hoy hay dos sitios del campo compitiendo por las mismas búsquedas, y el viejo
gana porque tiene años de antigüedad y enlaces apuntándole. Una redirección 301
le dice a Google que el sitio se mudó: en vez de tirar ese posicionamiento, lo
transfiere al `.org`.

## Lo que encontré revisando el sitio viejo

Dos cosas que conviene saber antes de tocar nada.

**1. El sitio viejo está roto por dentro.** Todos los enlaces del menú apuntan a
`www.campoescuelaflandes.com.ar`, un tercer dominio que **ya no resuelve**.
Alguien migró el sitio de `.com.ar` a `.net` y no reemplazó las URLs internas.
O sea: el visitante que entra al `.net` puede ver la portada, pero no puede
navegar a ninguna otra página. Todos los enlaces mueren.

**2. El contenido sí existe bajo el `.net`.** Aunque los enlaces estén rotos,
las páginas responden 200 si se las pide directo. Esas son las URLs que Google
tiene indexadas y las que hay que redirigir una por una, no todas a la portada:
un 301 masivo a la home Google lo trata como error y descarta el
posicionamiento.

Páginas viejas que verifiqué (todas responden 200):

| Página vieja | A dónde va en el sitio nuevo |
|---|---|
| `/contacto/` | `/contacto` |
| `/reservas-del-campo-escuela/` | `/reservas` |
| `/como-llegar-al-campo-escuela/` | `/contacto` (ahí está el mapa) |
| `/adiestramiento/` | `/adiestramiento` |
| `/cursos/` | `/adiestramiento` |
| `/dirigentes/` | `/adiestramiento` |
| `/descargas/` | `/biblioteca` |
| `/recursos/` | `/biblioteca` |
| `/cartilla/` | `/biblioteca` |
| `/folletos/` | `/biblioteca` |
| `/publicacione/` | `/biblioteca` |
| `/podcast/` | `/biblioteca` |
| `/sitios-de-interes/` | portada |
| entradas del blog (`/2023/03/06/…`) | `/agenda` |
| todo lo demás | portada |

## Cómo hacerlo

### Opción recomendada: el archivo `.htaccess`

Es la única que respeta el mapeo de arriba. En hPanel:

1. **Archivos → Administrador de archivos**
2. Entrar a `public_html`
3. Abrir `.htaccess` (si no se ve, activar "Mostrar archivos ocultos")
4. Pegar el bloque de abajo **arriba de todo**, antes de la línea
   `# BEGIN WordPress`

> **Esto es importante.** Si el bloque queda debajo del de WordPress, WordPress
> procesa primero y la redirección no llega a ejecutarse nunca.

```apache
# ── Mudanza a campoescuelaflandes.org ──────────────────────────────────────
<IfModule mod_rewrite.c>
RewriteEngine On

RewriteRule ^reservas-del-campo-escuela/?$   https://campoescuelaflandes.org/reservas       [R=301,L,NC]
RewriteRule ^como-llegar-al-campo-escuela/?$ https://campoescuelaflandes.org/contacto       [R=301,L,NC]
RewriteRule ^contacto/?$                     https://campoescuelaflandes.org/contacto       [R=301,L,NC]
RewriteRule ^adiestramiento/?$               https://campoescuelaflandes.org/adiestramiento [R=301,L,NC]
RewriteRule ^cursos/?$                       https://campoescuelaflandes.org/adiestramiento [R=301,L,NC]
RewriteRule ^dirigentes/?$                   https://campoescuelaflandes.org/adiestramiento [R=301,L,NC]

RewriteRule ^(descargas|recursos|cartilla|folletos|publicacione|podcast)/?$ https://campoescuelaflandes.org/biblioteca [R=301,L,NC]
RewriteRule ^category/(cursos|adiestramiento)/?$                           https://campoescuelaflandes.org/adiestramiento [R=301,L,NC]
RewriteRule ^[0-9]{4}/[0-9]{2}/[0-9]{2}/                                   https://campoescuelaflandes.org/agenda [R=301,L,NC]

# Todo lo demás, a la portada.
# Se excluye .well-known: por ahí pasa la renovación del certificado SSL, y
# redirigirla rompe el HTTPS del dominio viejo.
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^ https://campoescuelaflandes.org/ [R=301,L]
</IfModule>
# ── Fin de la mudanza ──────────────────────────────────────────────────────
```

### Opción simple: la herramienta de hPanel

Si no se quiere tocar archivos, hPanel tiene **Sitio web → Redirecciones**.
Manda todo a la portada, sin el mapeo página por página. Funciona, pero
transfiere menos posicionamiento.

## Cómo verificar que quedó bien

```bash
curl -sSI https://campoescuelaflandes.net/reservas-del-campo-escuela/ | head -5
```

Tiene que decir `301` y un `Location:` apuntando a
`https://campoescuelaflandes.org/reservas`. Si dice `200`, el bloque quedó mal
ubicado en el `.htaccess` (casi siempre: debajo del de WordPress).

## Dos advertencias

**El sitio viejo deja de ser visitable.** Es el objetivo, pero es irreversible
en la práctica. Antes de aplicarlo conviene bajar una copia del WordPress por si
hay contenido que todavía no está en el sitio nuevo. Revisando las páginas vi
material —cartillas, folletos, podcasts— que puede no estar migrado.

**No dar de baja el hosting de Hostinger.** La redirección vive ahí: si se
cancela el plan o se deja vencer el dominio `.net`, la redirección desaparece y
se pierde todo el posicionamiento que estaba transfiriendo. Hay que sostenerlo
al menos un año, hasta que Google haya terminado de mover el sitio.

## Después del 301

La redirección sola no alcanza. Faltan los enlaces que Google ya asocia al campo
y que hoy siguen apuntando al dominio viejo:

- El enlace "Sitio web" de la ficha de Google Maps / Google Business
- Facebook, Instagram y Linktree
