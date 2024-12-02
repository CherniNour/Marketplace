import React, { useEffect } from "react";
import { db } from "../../firebase.config"; // Firebase config file
import { collection, onSnapshot } from "firebase/firestore";
import axios from "axios";
 
const powerBIUrl =
  "https://api.powerbi.com/beta/a2d8336e-a299-4d52-8636-b7ef8c117a1d/datasets/f0374b3d-b921-40bb-8cec-f38fcdd7a79d/rows?experience=power-bi&key=kCeB0oC1FI5UsRMWxhrxy%2F90EXwxsCu0NvRYrMvkgWVRySkpxSrV4%2BMgve%2BDLqsU8ptKLrUIqXOWn7EWmqYm0w%3D%3D";
 
const pushToPowerBI = (data) => {
  axios
    .post(powerBIUrl, { rows: data })
    .then((response) => {
      if (response.status === 200) {
        console.log("Data successfully pushed to Power BI:", response.data);
      } else {
        console.error("Unexpected status code from Power BI:", response.status);
      }
    })
    .catch((error) => {
      console.error(
        "Error pushing data to Power BI:",
        error.response ? error.response.data : error.message
      );
    });
};
 
const DashboardPage = () => {
  useEffect(() => {
    // Listen for changes in the Firestore orders collection
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const orderData = doc.data();
 
        // Prepare the data to match your Power BI streaming dataset
        const payload = [
          {
            address: orderData.address,
            email: orderData.email,
            orderDate: orderData.orderDate, // Ensure this is a valid datetime format
            username: orderData.username,
          },
        ];
 
        // Push to Power BI
        pushToPowerBI(payload);
      });
    });
 
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);
 
  return (
    <div>
      <h2>Tableau de Bord Power BI</h2>
      <iframe title="elhanouut" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiNWEwNjJlZDctZDY2ZS00YTYwLWE3MjAtNWEzOWQ5NDM1NzBjIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9" frameborder="0" allowFullScreen="true"></iframe>    </div>
  );
};
 
export default DashboardPage;