# Addicionalseo

Web estàtica en codi per substituir l'actual WordPress de `addicionalseo.com`.

## Estructura

- `index.html` i `es/index.html`: portades en català i castellà
- `sobre-nosaltres/` i `es/agencia/`: pàgines d'agència
- `portfoli/` i `es/casos/`: casos i projectes
- `disseny-web/`, `seo/`, `seo-local/`, `google-ads/` i miralls dins `es/`
- `contacte/` i `es/contacto/`
- `magazine/` i `es/magazine/`
- articles comercials i editorials en català i castellà per reforçar SEO i interlinking

## Previsualitzar localment

Des de `C:\Projectes\Addicionalseo`:

```powershell
python -m http.server 4321 --bind 127.0.0.1 --directory C:\Projectes\Addicionalseo
```

Després obre:

- `http://127.0.0.1:4321/`
- `http://127.0.0.1:4321/es/`

## Abans de substituir la web antiga

1. Fer còpia de seguretat completa de fitxers i base de dades de WordPress.
2. Provar aquesta versió en un subdomini o directori temporal.
3. Verificar que les rutes importants actuals continuen existint o tenen redirecció.
4. Connectar el formulari de contacte a un enviament real al servidor.
5. Afegir textos legals i revisió final de cookies/analítica abans de producció.

## Notes

- La nova base està pensada per ser molt més lleugera que WordPress.
- Les URLs principals actuals s'han mantingut per minimitzar impacte SEO.
- Encara es poden afegir més articles o pàgines de servei abans de publicar.
