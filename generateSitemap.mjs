// generateSitemap.mjs

import { SitemapStream, streamToPromise } from "sitemap";
import fs from "fs";
import { db } from "./src/firebase.config.mjs"; // Correct import path for the ES module

import { collection, getDocs } from "firebase/firestore";

// Function to generate the sitemap
async function generateSitemap() {
  const urls = [];

  try {
    // Fetch product data from Firestore
    const querySnapshot = await getDocs(collection(db, "Product"));

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productUrl = `product/${doc.id}/${generateSlug(product.Product_name)}`;
      urls.push({ url: productUrl, changefreq: "daily", priority: 0.8 });
    });

    // Add key pages to the sitemap
    urls.push({ url: "/", changefreq: "weekly", priority: 1.0 });
    urls.push({ url: "/login", changefreq: "monthly", priority: 0.9 });
    urls.push({ url: "/signup", changefreq: "monthly", priority: 0.7 });
    urls.push({ url: "/Your cart", changefreq: "weekly", priority: 0.8 });
    urls.push({ url: "/My profile", changefreq: "monthly", priority: 0.6 });
    urls.push({ url: "/My-orders", changefreq: "monthly", priority: 0.6 });
    urls.push({ url: "/order-summary", changefreq: "weekly", priority: 0.7 });
    urls.push({ url: "/Add your product", changefreq: "monthly", priority: 0.6 });

    // Create sitemap stream and save it
    const sitemap = new SitemapStream({ hostname: "https://el-hanout-57170.web.app" });

    urls.forEach((url) => sitemap.write(url));
    sitemap.end();

    const xmlString = await streamToPromise(sitemap);
    fs.writeFileSync("public/sitemap.xml", xmlString.toString());
    console.log("Sitemap generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

// Function to generate slug from product name for SEO-friendly URL
function generateSlug(productName) {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Run the sitemap generation
generateSitemap();