# Deploy — Addicionalseo

Deploy via FTP del contingut font a `public_html`.

## Setup (primer cop)

1. Copia el fitxer d'exemple de credencials:
   ```
   copy _deploy\.env.deploy.example _deploy\.env.deploy
   ```

2. Edita `_deploy\.env.deploy` i omple les credencials:
   ```
   FTP_HOST=addicionalseo.com
   FTP_USER=v267231
   FTP_PASS=la_teva_contrasenya
   FTP_REMOTE=/public_html
   ```

3. Comprova que `.env.deploy` **no apareix a git**:
   ```
   git status
   ```
   No hauria de sortir `_deploy/.env.deploy` a la llista.

## Ús

Des de PowerShell, situa't a qualsevol lloc del projecte:

```powershell
# Deploy complet
.\_deploy\deploy.ps1

# Simula el deploy sense pujar res (recomanat abans del primer deploy real)
.\_deploy\deploy.ps1 -DryRun

# Puja només un fitxer concret
.\_deploy\deploy.ps1 -Only styles.css
.\_deploy\deploy.ps1 -Only "es/index.html"
```

## Què es puja

El script puja tot el contingut font del projecte excepte:

| Exclòs | Motiu |
|--------|-------|
| `.git/` | Metadades de git |
| `node_modules/` | Dependències locals |
| `dist/` | Build de Vite (no s'usa en producció) |
| `_deploy/` | El propi script de deploy |
| `docs/`, `references/` | Documentació interna |
| `vite.config.js`, `package.json` | Fitxers de dev |
| `.cpanel.yml`, `vercel.json` | Configs d'infra |
| `*.zip`, `*.bak`, `backup*/` | Arxius i backups |
| Imatges a l'arrel | Captures temporals |

## Flux recomanat

```
1. Fes els canvis
2. git add + git commit + git push
3. .\_deploy\deploy.ps1
4. Ctrl+F5 a https://addicionalseo.com/
```

## Seguretat

- `_deploy/.env.deploy` està al `.gitignore` — mai es puja a GitHub.
- Comprova-ho sempre amb `git status` abans de fer push.
- Si alguna vegada veus `.env.deploy` a `git status`, executa:
  ```
  git rm --cached _deploy/.env.deploy
  ```
