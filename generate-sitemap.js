const sitemap = require('sitemap');
const fs = require('fs');

// Définir les URL de votre site
const urls = [
    { url: '/', changefreq: 'daily', priority: 1.0, lastmod: new Date() },
    { url: '/welcome', changefreq: 'daily', priority: 0.9, lastmod: new Date() },
    { url: '/admin', changefreq: 'monthly', priority: 0.8, lastmod: new Date() },
    { url: '/cart', changefreq: 'daily', priority: 0.9, lastmod: new Date() },
    { url: '/research', changefreq: 'weekly', priority: 0.7, lastmod: new Date() },
    // Ajoutez d'autres URL selon vos besoins
];

// Créer le sitemap
const sitemapInstance = sitemap.createSitemap({
    hostname: 'https://www.votre-site.com',
    cacheTime: 600000, // 10 minutes
    urls: urls
});

// Générer le fichier sitemap.xml
fs.writeFileSync('./public/sitemap.xml', sitemapInstance.toString());
console.log('Sitemap généré avec succès dans le dossier public');
