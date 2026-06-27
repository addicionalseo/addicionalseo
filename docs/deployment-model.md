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

## Que no hacer

- No subir solo HTML suelto si depende de nuevos assets que no se han sincronizado.
- No copiar parcialmente assets hasheados desde `dist/`.
- No mezclar `index.html` fuente con CSS/JS/imágenes de una build antigua.

## Verificacion minima tras deploy

Comprobar en `/` y `/es/`:

- logos visibles
- hero con video/posters
- carrusel con portadas
- testimonios con logos
- favicons cargando
- sin 404 relevantes en `assets/`, `public/` o iconos raiz
