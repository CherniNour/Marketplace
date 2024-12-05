const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const { db } = require("../../firebase.config"); 
const { collection, getDocs } = require("firebase/firestore");

async function generateSitemap() {
  
  const urls = [];

  try {
    
    const querySnapshot = await getDocs(collection(db, "Product"));

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productUrl = `/product/${doc.id}`;  
      urls.push({ url: productUrl, changefreq: "daily", priority: 0.8 });
    });

    // Add other static pages to the sitemap (like homepage, categories, etc.)
    urls.push({ url: "/", changefreq: "weekly", priority: 1.0 });
    urls.push({ url: "/about", changefreq: "monthly", priority: 0.6 });
    urls.push({ url: "/contact", changefreq: "monthly", priority: 0.6 });

    // Create a new sitemap stream
    const sitemap = new SitemapStream({ hostname: "https://www.elhanout.com" });

    // Pipe URLs into the sitemap
    urls.forEach((url) => {
      sitemap.write(url);
    });
    sitemap.end();

    // Convert to XML and save to a file
    const xmlString = await streamToPromise(sitemap);
    fs.writeFileSync("public/sitemap.xml", xmlString.toString());
    console.log("Sitemap generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
