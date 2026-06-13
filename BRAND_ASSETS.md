# BRAND_ASSETS.md - Atelier Nox

## Objectif

Ce dossier documente les assets visuels de la marque Atelier Nox pour le site, les reseaux sociaux et les apercus de partage.

Atelier Nox doit rester: local, suisse, premium, humain, clair et mesurable.

## Palette principale

| Couleur | Hex | Usage recommande |
| --- | --- | --- |
| Vert profond | `#12382F` | Fonds premium, blocs de confiance, textes de marque |
| Creme | `#F5F1E8` | Fonds clairs, contraste doux, version light |
| Texte sombre | `#101820` | Texte principal, version dark |
| Orange action | `#E55D24` | Accents, CTA, detail du monogramme |
| Dore discret | `#D4AF37` | Montagnes, ligne premium, accents secondaires |
| Bleu-vert lac | `#1FA2A1` | Lignes du Lac Leman, details locaux |

## Assets officiels

| Fichier | Fonction | Dimensions | Format | Origine | Licence |
| --- | --- | --- | --- | --- | --- |
| `public/brand/atelier-nox-logo-horizontal-dark.svg` | Logo horizontal sur fond sombre | 720 x 180 viewBox | SVG | Creation locale Atelier Nox | Usage interne Atelier Nox |
| `public/brand/atelier-nox-logo-horizontal-light.svg` | Logo horizontal sur fond clair | 720 x 180 viewBox | SVG | Creation locale Atelier Nox | Usage interne Atelier Nox |
| `public/brand/atelier-nox-symbol-dark.svg` | Symbole sombre compact | 512 x 512 viewBox | SVG | Creation locale Atelier Nox | Usage interne Atelier Nox |
| `public/brand/atelier-nox-symbol-light.svg` | Symbole clair compact | 512 x 512 viewBox | SVG | Creation locale Atelier Nox | Usage interne Atelier Nox |
| `public/brand/favicon.svg` | Favicon simplifie | 64 x 64 viewBox | SVG | Creation locale Atelier Nox | Usage interne Atelier Nox |
| `public/brand/atelier-nox-avatar-1080.png` | Avatar Instagram / profils sociaux | 1080 x 1080 | PNG | Rendu local depuis le symbole dark | Usage interne Atelier Nox |
| `public/brand/apple-touch-icon.png` | Icone iOS / mobile | 180 x 180 | PNG | Rendu local depuis le symbole light | Usage interne Atelier Nox |
| `public/brand/og-image.png` | Open Graph / partage social | 1200 x 630 | PNG | Composition locale Atelier Nox | Usage interne Atelier Nox |
| `public/images/lausanne-hero.webp` | Hero principal approuve | 1920 x 1200 | WebP | Option 1 generee avec outil image_gen natif | Usage site approuve |

## Regles d'usage

- Ne pas etirer ou deformer les logos.
- Garder une marge de securite autour du symbole: au moins 12% de la largeur du symbole.
- Utiliser le logo dark sur fonds vert profond ou sombres.
- Utiliser le logo light sur fonds creme ou clairs.
- Ne pas ajouter d'ombre lourde, de glow artificiel ou d'effet startup.
- Ne pas ajouter de robot, chip, cerveau IA ou symbole technologique generique.
- Garder la marque lisible, sobre et suisse.

## Tailles minimales

- Logo horizontal: minimum 120 px de largeur.
- Symbole: minimum 32 px.
- Favicon: concu pour 16-32 px, details reduits.
- Avatar: export 1080 x 1080, mais doit rester lisible en vignette.

## Hero Lausanne

Le fichier `public/images/lausanne-hero.webp` est derive de l'option hero 1, choisie comme hero principal.

Contraintes pour le hero final:

- sans logo;
- sans texte;
- sans marque d'eau;
- Lausanne, Lac Leman et Alpes;
- architecture suisse a droite;
- espace visuel libre a gauche;
- composition horizontale;
- rendu naturel et premium.

Usage actuel:

- `lausanne-hero.webp` est utilise sur la home avec `next/image`;
- texte a gauche et image a droite sur desktop;
- texte puis image sur mobile;
- aucun texte, logo ou watermark n'est incorpore dans l'image.

## Open Graph

L'image `og-image.png` contient:

- logo Atelier Nox;
- phrase: "Nous pilotons votre croissance locale, avec vous.";
- mention: "Lausanne · Suisse romande";
- reference visuelle aux montagnes et au Lac Leman.

Elle est destinee aux partages sociaux et ne doit pas remplacer le hero du site.

## Notes de production

- SVGs crees manuellement/localement.
- PNGs et WebPs rendus avec `sharp`.
- Les options de hero ont ete generees avec l'outil `image_gen` natif du contexte Codex, sans OpenAI API configuree localement.
- Aucun token, secret ou credential n'est necessaire pour utiliser ces assets dans le projet.
