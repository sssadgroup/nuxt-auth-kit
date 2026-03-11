# Procédure de mise en ligne — nuxt-auth-kit

## Prérequis

- Node.js 18+
- Un compte sur [npmjs.com](https://www.npmjs.com)
- Git installé

---

## Étape 1 — Préparer le projet

### 1.1 Installer les dépendances
```bash
npm install
```

### 1.2 Configurer le build (module builder)
Assurez-vous que `nuxt.schema.ts` ou la config de build pointe bien vers `src/module/index.ts` comme point d'entrée.

Dans `package.json`, vérifiez :
```json
{
  "exports": {
    ".": {
      "import": "./dist/module.mjs",
      "require": "./dist/module.cjs"
    }
  },
  "main": "./dist/module.cjs",
  "types": "./dist/types.d.ts",
  "files": ["dist"]
}
```

---

## Étape 2 — Builder le package

```bash
npm run build
```

Cela génère le dossier `dist/` avec :
- `dist/module.mjs` — version ESM
- `dist/module.cjs` — version CommonJS  
- `dist/types.d.ts` — types TypeScript

---

## Étape 3 — Tester localement avant publication

### Option A — npm link
```bash
# Dans le dossier nuxt-auth-kit
npm link

# Dans votre projet Nuxt
npm link nuxt-auth-kit
```

### Option B — yalc (recommandé)
```bash
# Installer yalc globalement
npm install -g yalc

# Dans nuxt-auth-kit
yalc publish

# Dans votre projet Nuxt
yalc add nuxt-auth-kit
```

### Option C — npm pack + install local
```bash
# Dans nuxt-auth-kit
npm pack
# Génère nuxt-auth-kit-1.0.0.tgz

# Dans votre projet Nuxt
npm install ../nuxt-auth-kit/nuxt-auth-kit-1.0.0.tgz
```

---

## Étape 4 — Se connecter à npm

```bash
npm login
# Entrez votre username, password et email
# Si 2FA activé, entrez votre code OTP
```

Vérifiez que vous êtes connecté :
```bash
npm whoami
# Doit afficher votre username
```

---

## Étape 5 — Vérifier avant publication

```bash
# Voir ce qui sera publié
npm pack --dry-run

# Vérifier les infos du package
npm publish --dry-run
```

Assurez-vous que :
- `package.json` a le bon `name` (unique sur npm)
- La `version` est correcte (semver : `1.0.0`)
- `files` inclut `["dist"]`
- `README.md` est présent

---

## Étape 6 — Publier

### Publication publique
```bash
npm publish --access public
```

### Publication avec scope (ex: `@votre-org/nuxt-auth-kit`)
```bash
# Dans package.json, name: "@votre-org/nuxt-auth-kit"
npm publish --access public
```

---

## Étape 7 — Versioning pour les mises à jour

```bash
# Correction de bug (1.0.0 → 1.0.1)
npm version patch

# Nouvelle fonctionnalité rétrocompatible (1.0.0 → 1.1.0)
npm version minor

# Breaking change (1.0.0 → 2.0.0)
npm version major

# Puis publier
npm run build && npm publish
```

---

## Étape 8 — GitHub (optionnel mais recommandé)

```bash
# Initialiser git
git init
git add .
git commit -m "feat: initial release v1.0.0"

# Créer un repo sur GitHub, puis
git remote add origin https://github.com/votre-user/nuxt-auth-kit.git
git branch -M main
git push -u origin main

# Créer un tag de version
git tag v1.0.0
git push origin v1.0.0
```

---

## Étape 9 — Automatiser avec GitHub Actions (CI/CD)

Créez `.github/workflows/publish.yml` :

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

> Ajoutez `NPM_TOKEN` dans les secrets GitHub (Settings → Secrets → Actions).
> Générez le token sur npmjs.com : Account → Access Tokens → Automation.

---

## Récapitulatif rapide

```bash
# 1. Build
npm run build

# 2. Connexion npm (une seule fois)
npm login

# 3. Publication
npm publish --access public

# Pour les mises à jour
npm version patch   # ou minor/major
npm run build
npm publish
```

---

## Installation dans un projet

Une fois publié, vos collègues/clients peuvent l'installer ainsi :

```bash
npm install nuxt-auth-kit
```

Puis dans `nuxt.config.ts` :
```ts
export default defineNuxtConfig({
  modules: ['nuxt-auth-kit'],
  nuxtAuthKit: {
    apiBase: 'https://api.monprojet.com'
  }
})
```

**C'est tout !** 🎉
