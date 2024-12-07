import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";  // Correct import for ResponsiveBar
import { db } from "../../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [roleDistributionData, setRoleDistributionData] = useState([]);
  const [locationDistributionData, setLocationDistributionData] = useState([]);
  const [categoryDistributionData, setCategoryDistributionData] = useState([]);
  const [orderStatusDistributionData, setOrderStatusDistributionData] = useState([]);

  useEffect(() => {
    // Fetch Users
    const unsubscribeUsers = onSnapshot(collection(db, "User"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => doc.data());
      setTotalUsers(usersData.length);

      // Role Distribution
      const roleCounts = usersData.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      const transformedRoleData = Object.keys(roleCounts).map((key) => ({
        id: key,
        label: key,
        value: roleCounts[key],
      }));
      setRoleDistributionData(transformedRoleData);

      // Location Distribution
      const locationCounts = usersData.reduce((acc, user) => {
        acc[user.address] = (acc[user.address] || 0) + 1;
        return acc;
      }, {});
      const transformedLocationData = Object.keys(locationCounts).map((key) => ({
        id: key,
        label: key,
        value: locationCounts[key],
      }));
      setLocationDistributionData(transformedLocationData);
    });

    // Fetch Orders
    const unsubscribeOrders = onSnapshot(collection(db, "Orders"), (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => doc.data());
      setTotalOrders(ordersData.length);

 

      // Order Status Distribution
      const statusCounts = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      const transformedOrderStatusData = Object.keys(statusCounts).map((key) => ({
        id: key,
        label: key,
        value: statusCounts[key],
      }));
      setOrderStatusDistributionData(transformedOrderStatusData);
    });

    // Fetch Product Category Distribution
    const unsubscribeProducts = onSnapshot(collection(db, "Product"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => doc.data());
      const categoryCounts = productsData.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      const transformedCategoryData = Object.keys(categoryCounts).map((key) => ({
        id: key,
        label: key,
        value: categoryCounts[key],
      }));
      setCategoryDistributionData(transformedCategoryData);
    });

    // Cleanup listeners
    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <h2>{totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <h2>{totalOrders}</h2>
          <p>Total Orders</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Role Distribution */}
        <div style={{ height: "400px" }}>
          <h3>Role Distribution</h3>
          {roleDistributionData.length > 0 ? (
            <ResponsivePie
              data={roleDistributionData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
              radialLabel={(d) => d.label}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Location Distribution */}
        <div style={{ height: "400px" }}>
          <h3>Location Distribution</h3>
          {locationDistributionData.length > 0 ? (
            <ResponsiveBar
              data={locationDistributionData}
              keys={["value"]}
              indexBy="label"
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              colors={{ scheme: "nivo" }}
              axisBottom={{ tickSize: 5, tickPadding: 5 }}
              axisLeft={{ tickSize: 5, tickPadding: 5 }}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Product Category Distribution */}
        <div style={{ height: "400px" }}>
          <h3>Product Category Distribution</h3>
          {categoryDistributionData.length > 0 ? (
            <ResponsivePie
              data={categoryDistributionData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
              radialLabel={(d) => d.label}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Order Status Distribution */}
        <div style={{ height: "400px" }}>
          <h3>Order Status Distribution</h3>
          {orderStatusDistributionData.length > 0 ? (
            <ResponsivePie
              data={orderStatusDistributionData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
              radialLabel={(d) => d.label}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
