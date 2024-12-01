const fs = require("fs");
 
// Function to convert Firestore timestamp (_seconds and _nanoseconds) to a readable date
const convertFirestoreTimestampToDate = (timestamp) => {
  const seconds = timestamp._seconds;
  const nanoseconds = timestamp._nanoseconds;
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  return new Date(milliseconds).toISOString(); // Convert to ISO format
};
 
// Read the existing data from the JSON file
const rawData = fs.readFileSync("orders.json"); // Path to your exported JSON file
const orders = JSON.parse(rawData);
 
// Process the orders and convert orderDate timestamps
const processedOrders = orders.map((order) => {
  return {
    ...order,
    orderDate: convertFirestoreTimestampToDate(order.orderDate), // Convert timestamp to date
  };
});
 
// Save the processed data back to the same JSON file
fs.writeFileSync("orders.json", JSON.stringify(processedOrders, null, 2));
console.log("Timestamps converted and data saved back to orders.json.");