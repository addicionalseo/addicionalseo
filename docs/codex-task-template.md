# Plantilla de petición para Codex — Addicionalseo

Copia y pega esta plantilla cuando quieras pedir una tarea a Codex.

```text
Contexto:
Estoy trabajando en el proyecto addicionalseo.com.

Objetivo:
[Explica aquí qué quieres conseguir]

Modo de trabajo:
[Elige uno o varios]
AUDIT | PLAN | DEV MODE | SEO MODE | COPY MODE | DEBUG | ROOT CAUSE | RISK CHECK | CHECKLIST

Restricciones:
- No elimines contenido existente salvo que sea imprescindible.
- No cambies el diseño visual si no te lo pido.
- No modifiques textos comerciales importantes sin avisar.
- No rompas SEO, responsive, formularios, menús, footer, anchors ni enlaces internos.
- Si el cambio afecta varias páginas, primero explícame el plan.

Proceso obligatorio:
1. Revisa los archivos relevantes.
2. Dime qué archivos vas a tocar.
3. Explica el plan.
4. Aplica solo los cambios necesarios.
5. Resume qué has cambiado.
6. Dame una checklist para verificarlo.

Resultado esperado:
[Describe cómo sabremos que está bien]
```

## Prompt para instalar estos documentos en el proyecto

Úsalo si todavía no has colocado estos archivos en el repositorio.

```text
Lee el contenido de los archivos que te voy a adjuntar para Codex.

Crea esta estructura en la raíz del proyecto addicionalseo:

- AGENTS.md
- docs/codex-prompt-cues-addicionalseo.md
- docs/codex-task-template.md

No modifiques todavía ningún archivo de producción de la web.
Solo crea o actualiza la documentación necesaria para que Codex pueda usar estos prompt cues como guía de trabajo.

Después, confirma:
1. qué archivos has creado o actualizado;
2. dónde los has colocado;
3. cómo debo usarlos en futuras tareas.
```

## Prompt para que Codex lea la guía antes de trabajar

```text
Antes de empezar, lee `AGENTS.md` y `docs/codex-prompt-cues-addicionalseo.md`.
Después trabaja siguiendo esas instrucciones.
No apliques cambios hasta explicarme el plan si detectas que puede afectar SEO, diseño, formularios, enlaces internos o estructura de la web.
```
