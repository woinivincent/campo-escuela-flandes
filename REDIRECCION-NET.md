# Redirección 301 de `campoescuelaflandes.net` → `campoescuelaflandes.org`

Esto **no se hace desde este repositorio**. El `.net` es otro sitio, en otro
hosting, y la redirección se configura allá.

## Dónde está el sitio viejo

- **Dominio:** `campoescuelaflandes.net`
- **Hosting:** Hostinger (hPanel)
- **Registrador:** Hostinger — dominio y hosting están en la misma cuenta
- **Software:** WordPress 6.6.10
- **Estado:** vivo y respondiendo 200
- **Registrado:** 3 de abril de 2023
- **Vence:** 3 de abril de 2027
- **Último cambio en el dominio:** 7 de marzo de 2026

Ese último dato es el que importa para destrabar esto: alguien renovó o modificó
el dominio en marzo de 2026, así que **hay una persona con acceso a esa cuenta**.
No es un sitio abandonado.

La fecha de vencimiento marca el plazo real. Si llega abril de 2027 y nadie
renueva, el `.net` desaparece: se termina la competencia, pero también la
posibilidad de transferir el posicionamiento. Conviene resolverlo antes.

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

Hay tres caminos. Cuál sirve depende de **qué acceso se consiga**, que es hoy el
único obstáculo. Van ordenados del más fácil de conseguir al mejor.

### Opción A: con la clave de WordPress (sin tocar Hostinger)

La clave de WordPress es distinta de la del panel de Hostinger, y suele estar
más a mano: la tiene quien cargaba las noticias del sitio viejo. Verifiqué que
el acceso está abierto en `campoescuelaflandes.net/wp-login.php`.

Con eso alcanza:

1. Entrar a `campoescuelaflandes.net/wp-admin`
2. **Plugins → Añadir nuevo**, buscar **Redirection** (de John Godley) e
   instalarlo
3. En **Herramientas → Redirection**, cargar una regla por cada fila de la
   tabla de arriba, con tipo **301 Moved Permanently**
4. Para el resto, una regla final con origen `/.*` (expresión regular activada)
   y destino `https://campoescuelaflandes.org/`

Hace exactamente lo mismo que el `.htaccess`. Es más tedioso de cargar, pero no
necesita entrar al hosting ni editar archivos.

### Opción B: el archivo `.htaccess` (necesita Hostinger)

Es la más limpia y la que menos depende de WordPress. En hPanel:

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

### Opción C: la herramienta de hPanel (necesita Hostinger)

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

## Mientras tanto: lo que no depende de ningún acceso

El 301 está trabado esperando una clave, pero **no es lo único que mueve la
aguja, y probablemente ni siquiera sea lo que más**. Para una institución local,
lo que decide qué aparece primero al buscar "campo escuela flandes" son las
fichas y las redes, y esas las maneja el campo, no Hostinger:

1. **Google Business / Google Maps** — cambiar el enlace "Sitio web" al `.org`.
   De toda esta lista, es lo de mayor impacto y lo más rápido: la ficha de Google
   es lo primero que ve alguien buscando el campo desde el celular.
2. **Facebook e Instagram** — el enlace del perfil.
3. **Linktree** — si sigue en uso.

Hoy ninguno de los tres apunta al `.org`. Son las señales que Google usa para
decidir cuál de los dos sitios es "el oficial", así que mientras sigan apuntando
al dominio viejo le están diciendo lo contrario de lo que queremos.

## Para pedir el acceso

Texto para reenviarle a quien corresponda en el campo:

> Necesitamos destrabar algo del sitio nuevo. Todavía existe el sitio viejo en
> `campoescuelaflandes.net`, y mientras los dos convivan compiten entre sí en
> Google: el viejo aparece primero y el nuevo queda abajo.
>
> La solución es redirigir el viejo al nuevo, que además transfiere el
> posicionamiento que ya tenía en vez de perderlo. Es un cambio de una sola vez.
>
> Para hacerlo alcanza con **cualquiera de estos dos accesos**:
>
> - La clave de **WordPress** del sitio viejo (la que se usaba para cargar
>   noticias), o
> - La cuenta de **Hostinger** donde está alojado
>
> Con la de WordPress ya es suficiente. ¿Alguien la tiene o sabe quién la tiene?
> El dominio se renovó en marzo de 2026, así que alguien de la comisión tiene
> esa cuenta.
>
> Un aviso: el dominio vence el **3 de abril de 2027**. Conviene resolverlo
> antes, porque si vence sin redirigir se pierde todo lo que ese sitio tenía
> ganado.
>
> Y antes de aplicar el cambio conviene bajar una copia del sitio viejo: hay
> material ahí —cartillas, folletos, podcasts— que puede no estar en el nuevo.

## Después del 301

Las fichas y redes del punto anterior, si no se hicieron antes.
