# Loren Deklerk — Engineering Portfolio

A static, multi-page portfolio built with HTML, CSS, and JavaScript. The Express server provides local static hosting; contact enquiries on the Netlify deployment use native Netlify Forms.

## Local development

```bash
npm install
npm start
```

The local site is served at `http://localhost:3001`. There is no compile step. `npm run check` runs Node syntax checks on the server and browser scripts.


## Deployment

Publish the `src` directory as the Netlify site root so the HTML form is present in the deployed files for build-time detection. The Express server remains available for local hosting and serves the static portfolio; it no longer provides contact email delivery.