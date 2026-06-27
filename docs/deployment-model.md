# Modelo de Publicacion

## Modelo activo

Addicionalseo se publica como **HTML fuente directo desde la raiz del repositorio** hacia `public_html`.

No se usa `dist/` como artefacto de produccion para este sitio.
No se deben mezclar archivos hasheados de Vite con HTML fuente del repo.

## Fuente de verdad

- HTML principal: `index.html` y `es/index.html`
- Paginas internas: carpetas del repo en raiz y dentro de `es/`
- Assets estaticos: `assets/`
- Recursos multimedia de home: `public/`
- Iconos raiz: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`

## Regla de rutas

- Si el sitio se publica desde la raiz del repo, las rutas deben apuntar a archivos reales que existan en `public_html`.
- Las rutas `/assets/...` deben corresponder a archivos reales dentro de `public_html/assets/`.
- Las rutas `/public/...` son validas solo si la carpeta `public/` se publica literalmente a `public_html/public/`.
- No referenciar archivos hasheados de Vite desde HTML fuente manual.

## Despliegue correcto

El archivo [\.cpanel.yml](C:/Projectes/Addicionalseo/.cpanel.yml) define el modelo esperado:

```yaml
deployment:
  tasks:
    - export DEPLOYPATH=$HOME/public_html/
    - /bin/rsync -av --exclude='.git' --exclude='.cpanel.yml' --exclude='_deploy-backup' --exclude='node_modules' --exclude='.github' ./ $DEPLOYPATH
```

Esto implica:

1. Se despliega el repo fuente, no `dist/`.
2. `public/` debe existir tambien en produccion.
3. Los iconos raiz deben subirse en raiz.
4. `assets/` debe mantenerse sincronizado con el repo.

## Flujo operativo recomendado

1. Hacer los cambios en el repo fuente.
2. Verificar localmente `/` y `/es/`.
3. Confirmar que los nuevos assets existen realmente en `assets/`, `public/` o raiz.
4. Hacer commit y push a `main`.
5. Publicar sincronizando el repo fuente completo hacia `public_html`.
6. Verificar produccion en `https://addicionalseo.com/` y `https://addicionalseo.com/es/`.

## Regla de publicacion

- Si se publica `index.html`, tambien deben publicarse en la misma operacion los assets nuevos que ese HTML o CSS necesiten.
- Si se añade una referencia nueva en `styles.css`, el archivo fisico correspondiente debe existir en produccion.
- No dejar una publicacion a medias con HTML nuevo y recursos antiguos.
- No usar `dist/` como parche puntual si la web publicada depende del HTML fuente del repo.

## Que no hacer

- No subir solo HTML suelto si depende de nuevos assets que no se han sincronizado.
- No copiar parcialmente assets hasheados desde `dist/`.
- No mezclar `index.html` fuente con CSS/JS/imágenes de una build antigua.
- No dejar en `public_html` una mezcla de nombres hasheados y nombres fuente para la misma home.
- No asumir que `/public/...` existe en produccion si no se ha sincronizado la carpeta `public/`.

## Verificacion minima tras deploy

Comprobar en `/` y `/es/`:

- logos visibles
- hero con video/posters
- carrusel con portadas
- testimonios con logos
- favicons cargando
- sin 404 relevantes en `assets/`, `public/` o iconos raiz

## Assets criticos de home

Revisar especialmente:

- `/assets/logo-header.png`
- `/assets/logo.png`
- `/assets/hero-poster.png`
- portadas del carrusel dentro de `/assets/`
- `/public/media/home/images/`
- `/public/media/home/videos/`
- `/favicon.ico`
- `/favicon-16x16.png`
- `/favicon-32x32.png`
- `/apple-touch-icon.png`
