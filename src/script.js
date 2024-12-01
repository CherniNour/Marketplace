const admin = require("firebase-admin");
const fs = require("fs");
const serviceAccount = require("./el-hanout-57170-firebase-adminsdk-lqf27-f88ed3e7c4.json"); // Path to your service account JSON file
 
// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use the service account file
});
 
const db = admin.firestore();
 
// Function to export a single collection
const exportCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
 
  // Save data to a JSON file
  fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
  console.log(
    `Exported ${data.length} documents from the ${collectionName} collection.`
  );
};
 
// Function to export all collections
const exportAllCollections = async () => {
  const collectionsSnapshot = await db.listCollections(); // Get list of all collections
 
  for (const collection of collectionsSnapshot) {
    await exportCollection(collection.id); // Call the export function for each collection
  }
 
  console.log("Export completed for all collections.");
};
 
// Start exporting all collections
exportAllCollections();