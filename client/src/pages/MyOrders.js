import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>
          You have no orders yet. <Link to="/products">Start shopping</Link>
        </p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.isPaid ? "Paid" : "Not Paid"}</td>
                <td>{order.isDelivered ? "Delivered" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;