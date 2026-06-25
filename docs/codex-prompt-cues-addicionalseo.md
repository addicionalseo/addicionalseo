# Prompt cues para Codex — Addicionalseo

Este documento adapta los “prompt cues” del PDF de referencia a un uso práctico con **Codex** dentro del proyecto **addicionalseo.com**.

Importante: estos códigos no son comandos secretos ni puertas traseras. Son etiquetas de prompting para indicar a la IA el tono, el nivel de profundidad, el formato o el enfoque de trabajo.

## Cómo usarlos con Codex
Puedes empezar una petición con uno o varios códigos separados por `|`.

Ejemplo:

```text
SEO MODE | AUDIT | CHECKLIST
Revisa la home de addicionalseo.com y dime qué cambios harías para mejorar rastreo, indexación y conversión sin modificar archivos todavía.
```

Codex debe interpretar estos códigos como instrucciones de trabajo, no como código que se deba insertar en la web.

---

## Códigos principales para Addicionalseo

### AUDIT
Revisa el estado actual antes de cambiar nada.

Úsalo para:
- detectar errores HTML, CSS o JS;
- revisar SEO técnico;
- encontrar enlaces rotos;
- comprobar formularios, CTAs y anchors;
- revisar problemas de responsive.

Prompt ejemplo:

```text
AUDIT | FACTS ONLY | CHECKLIST
Revisa el proyecto y enumera problemas técnicos reales. No modifiques archivos todavía.
```

---

### PLAN
Codex debe proponer una estrategia antes de ejecutar.

Úsalo cuando:
- el cambio afecte varias páginas;
- haya riesgo de romper SEO;
- se vaya a modificar estructura, navegación, footer, formularios o sitemaps.

Prompt ejemplo:

```text
PLAN | RISK CHECK
Quiero mejorar la estructura de enlazado interno. Primero dime qué archivos tocarías y por qué. No ejecutes cambios todavía.
```

---

### DEV MODE
Modo técnico: menos explicación, más código y pasos concretos.

Prompt ejemplo:

```text
DEV MODE | CHECKLIST
Corrige el error del anchor del botón de contacto. Haz el cambio mínimo necesario y dime qué archivo has tocado.
```

---

### SEO MODE
Prioriza SEO técnico, rastreo, intención de búsqueda, estructura interna y conversión.

Revisar especialmente:
- titles;
- meta descriptions;
- canonicals;
- hreflang si hay idiomas;
- headings H1/H2/H3;
- enlaces internos;
- sitemap;
- robots.txt;
- schema markup;
- velocidad y peso de assets;
- duplicidades de contenido.

Prompt ejemplo:

```text
SEO MODE | AUDIT | RISK CHECK
Analiza si los cambios propuestos pueden afectar a indexación o posicionamiento. No cambies nada sin plan previo.
```

---

### COPY MODE
Mejora textos para que suenen humanos, claros y comerciales sin parecer IA.

Prompt ejemplo:

```text
COPY MODE | HUMANIZE | ANTI-SLOP
Reescribe este bloque para que suene más profesional, natural y orientado a conversión, sin exageraciones ni frases genéricas.
```

---

### FACT-CHECK
Verifica antes de afirmar.

Úsalo para:
- datos técnicos;
- SEO;
- comportamiento de crawlers;
- robots.txt;
- configuración de servidor;
- compatibilidad del navegador.

Prompt ejemplo:

```text
FACT-CHECK | RISK CHECK
Antes de tocar robots.txt, revisa si la regla propuesta puede bloquear Googlebot, Bingbot, GPTBot, ChatGPT-User u otros crawlers legítimos.
```

---

### RISK CHECK
Busca riesgos antes de publicar.

Debe revisar:
- impacto SEO;
- impacto visual;
- impacto móvil;
- formularios;
- scripts;
- rendimiento;
- seguridad;
- indexación.

Prompt ejemplo:

```text
RISK CHECK | PRE-MORTEM
Imagina que este cambio rompe la web o baja el SEO. Dime qué podría fallar antes de aplicarlo.
```

---

### CHECKLIST
Devuelve una lista de verificación accionable.

Prompt ejemplo:

```text
CHECKLIST
Dame los pasos exactos para probar que el cambio funciona en escritorio, móvil y SEO técnico.
```

---

### DEBUG
Encuentra y explica errores de código.

Prompt ejemplo:

```text
DEBUG | DEV MODE
Localiza por qué este botón no hace scroll al formulario. Aplica solo el arreglo mínimo.
```

---

### ROOT CAUSE
Busca la causa raíz, no solo el síntoma.

Prompt ejemplo:

```text
ROOT CAUSE | DEBUG
El CTA funciona en la home pero no en páginas internas. Encuentra la causa real y propón una solución estable.
```

---

### COMPARE
Compara opciones antes de decidir.

Prompt ejemplo:

```text
COMPARE: opción A vs opción B | SEO MODE
Compara estas dos formas de estructurar las landings y dime cuál conviene más para SEO local.
```

---

### TEMPLATE
Crea plantillas reutilizables.

Prompt ejemplo:

```text
TEMPLATE | SEO MODE
Crea una plantilla reutilizable para nuevas landings de servicios SEO, con estructura de headings, CTAs, FAQs y enlaces internos.
```

---

## Combos recomendados para Jordi

### Revisión técnica antes de tocar nada
```text
AUDIT | FACTS ONLY | CHECKLIST
Revisa el proyecto y detecta problemas reales. No modifiques archivos todavía.
```

### Cambio pequeño y controlado
```text
DEV MODE | RISK CHECK
Aplica el cambio mínimo necesario. No cambies diseño ni textos no relacionados.
```

### SEO técnico
```text
SEO MODE | AUDIT | ROOT CAUSE | CHECKLIST
Revisa rastreo, indexación, titles, metas, canonicals, sitemap, robots, enlaces internos y rendimiento.
```

### Mejorar textos comerciales
```text
COPY MODE | HUMANIZE | ANTI-SLOP | MAKE IT POP
Mejora el texto para que sea más claro, natural y convincente sin sonar artificial.
```

### Resolver errores difíciles
```text
DEBUG | ROOT CAUSE | RISK CHECK | DEV MODE
Encuentra la causa real, aplica el arreglo mínimo y dime cómo verificarlo.
```

### Cambios grandes en varias páginas
```text
PLAN | PRE-MORTEM | RISK CHECK
Antes de modificar nada, dime el plan, los archivos afectados, riesgos y pruebas necesarias.
```

---

## Regla importante
Si Codex no está seguro de si un código aplica a la tarea, debe priorizar:

1. estabilidad de la web;
2. SEO;
3. seguridad;
4. claridad del cambio;
5. mínima modificación necesaria.

Nunca debe insertar estos prompt cues dentro del HTML visible de la web salvo que Jordi lo pida expresamente como contenido editorial.
