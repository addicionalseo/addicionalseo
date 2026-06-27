# Runbook de Deploy

## Objetivo

Publicar Addicionalseo sin mezclar HTML fuente, `dist/` ni assets incompletos.

## Modelo valido

- Fuente de verdad: repo en raiz
- Destino: `public_html`
- Publicacion: sincronizacion completa del sitio fuente

## Pasos antes de publicar

1. Revisar `git status`.
2. Confirmar que los cambios de HTML, CSS y JS ya estan en el repo.
3. Confirmar que cualquier asset nuevo existe en local.
4. Verificar localmente:
   - `/`
   - `/es/`
5. Hacer commit y push.

## Pasos de publicacion

1. Publicar el contenido fuente del repo hacia `public_html`.
2. Asegurar que se incluyen:
   - `index.html`
   - `es/index.html`
   - `styles.css`
   - `script.js`
   - `assets/`
   - `public/`
   - iconos de raiz
3. No sustituir solo una parte del sitio si depende de recursos nuevos.

## Checklist post-deploy

- `https://addicionalseo.com/` carga bien
- `https://addicionalseo.com/es/` carga bien
- logo del header visible
- hero visible
- fondos visibles
- carrusel con portadas
- favicons correctos
- sin 404 relevantes en consola o red

## Si algo falla

- Si falta un logo, revisar `assets/logo-header.png` y `assets/logo.png`.
- Si falta un fondo o portada, revisar `assets/` y las rutas referenciadas en HTML/CSS.
- Si falta multimedia de home, revisar `public/media/home/`.
- Si falla un favicon, revisar los iconos en raiz.
- Si hay 404, no subir archivos sueltos al azar: identificar primero si falta el archivo en repo o en `public_html`.

## Que no volver a hacer

- No publicar `dist/` sobre una web que usa HTML fuente.
- No mezclar assets hasheados con rutas fuente.
- No dar por hecho que un push a git ya ha sincronizado `public_html`.
- No hacer deploy parcial de home cuando cambian HTML y assets a la vez.
