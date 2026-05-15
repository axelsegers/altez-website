# Altez Website

Statische landingspagina voor **Altez Construction Group** — industriebouw, renovatie, landbouw en paardenprojecten. Gebaseerd op de inhoud van [altez.eu](https://www.altez.eu).

Gehost op GitHub Pages: **https://altez.smartagents.be**

## Structuur

```
.
├── index.html      Eenpagina-site (NL)
├── styles.css      Volledig CSS-systeem (Manrope, klassieke layout)
├── script.js       Mobile menu, scroll-reveal, count-up
├── images/         Foto's overgenomen van altez.eu + hero-video (Pexels)
└── CNAME           Custom domain voor GitHub Pages
```

## Lokaal draaien

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.

## Deploy

Push naar `main` → GitHub Pages bouwt en publiceert automatisch op `altez.smartagents.be`.

## Hero-media

De hero gebruikt een slideshow van échte Altez-projectfoto's (`images/project-*.jpg`). Wil je een video gebruiken, drop `hero-sd.mp4` in `images/` en wissel de `<div class="hero__slideshow">` in `index.html` om naar:

```html
<video class="hero__bg" autoplay muted loop playsinline poster="images/hero.jpg">
  <source src="images/hero-sd.mp4" type="video/mp4" />
</video>
```
