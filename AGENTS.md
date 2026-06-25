# AGENTS.md — Instrucciones para Codex en Addicionalseo

Este archivo guía a Codex cuando trabaje dentro del repositorio de **addicionalseo.com**.

## Idioma y estilo de respuesta
- Responde siempre en **castellano**, salvo que Jordi pida catalán.
- Sé directo, práctico y técnico cuando haga falta.
- No des la razón automáticamente: avisa si una petición puede romper SEO, diseño, rendimiento, seguridad o indexación.
- Antes de ejecutar cambios importantes, explica el plan y espera confirmación si el cambio puede afectar muchas páginas.

## Prioridades del proyecto
1. Mantener la web estable y online.
2. No romper diseño, responsive, formularios, CTAs, menús, footer, enlaces internos ni SEO.
3. Mejorar rendimiento, rastreo, indexación, estructura HTML, accesibilidad y conversión.
4. Mantener coherencia de marca de Addicionalseo.
5. Documentar cualquier cambio relevante.

## Fuentes internas de referencia
Consulta estos documentos cuando existan:
- `docs/codex-prompt-cues-addicionalseo.md`
- `docs/codex-task-template.md`
- `README.md`
- `robots.txt`
- `sitemap.xml` o sitemaps equivalentes

## Flujo obligatorio antes de modificar archivos
Antes de tocar código:
1. Revisa la estructura del proyecto.
2. Identifica exactamente qué archivos se verán afectados.
3. Explica el plan de cambios.
4. Si hay riesgo alto, pregunta antes de modificar.

Después de modificar:
1. Resume qué archivos cambiaste.
2. Explica qué cambió en cada archivo.
3. Indica cómo verificarlo.
4. Señala riesgos pendientes o pruebas que Jordi debería hacer.

## Guardrails / límites
- No elimines contenido existente salvo que se pida expresamente.
- No cambies textos comerciales importantes sin avisar.
- No generes contenido SEO masivo de baja calidad.
- No uses técnicas black-hat SEO, cloaking, keyword stuffing ni contenido engañoso.
- No añadas dependencias externas innecesarias.
- No introduzcas scripts de terceros sin explicar para qué sirven.
- No incluyas claves API, contraseñas, tokens ni datos sensibles en el repositorio.
- No crees archivos específicos de Claude, como `CLAUDE.md`, salvo que Jordi lo pida expresamente. Este proyecto debe trabajarse con Codex.

## Criterios de calidad para cambios web
Comprueba siempre que:
- Los enlaces internos siguen funcionando.
- Los anchors y CTAs apuntan a secciones existentes.
- La versión móvil no queda rota.
- El HTML mantiene estructura semántica.
- Los cambios no perjudican title, meta description, canonical, hreflang, robots o sitemap.
- No se duplican bloques innecesarios.
- No se rompen formularios ni scripts existentes.

## Modo de trabajo recomendado
Usa estos modos como guía interna según el tipo de tarea:
- `AUDIT`: revisar sin modificar.
- `PLAN`: proponer pasos antes de tocar código.
- `DEV MODE`: menos explicación y más cambios concretos.
- `SEO MODE`: priorizar indexación, rastreo, intención de búsqueda y arquitectura interna.
- `COPY MODE`: mejorar textos sin sonar artificial.
- `RISK CHECK`: detectar riesgos antes de publicar.
- `CHECKLIST`: cerrar la tarea con lista de verificación.

## Cuando Jordi pida “aplica los códigos”
No interpretes los “códigos secretos” como comandos ocultos ni código de programación para la web. Son **formas de pedir mejor el trabajo a la IA**. Úsalos como estilos de trabajo y organización, no como scripts que deban insertarse en la web.

Si Jordi entrega un PDF o documento de prompts:
1. Extrae solo lo útil para Codex.
2. Crea o actualiza documentación en `docs/`.
3. No mezcles instrucciones de Claude/Claude Code si no aplican a Codex.
4. Propón un sistema simple de prompts reutilizables para tareas de SEO, diseño, depuración y mantenimiento.
