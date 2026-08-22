import { useEffect, useState } from "react";
import api from "../../utils/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      fetchOrders();
    } catch (err) {
      setError("Could not update order");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>All Orders</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user ? order.user.name : "Deleted User"}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.isPaid ? "Yes" : "No"}</td>
              <td>{order.isDelivered ? "Yes" : "No"}</td>
              <td>
                {!order.isDelivered && (
                  <button onClick={() => deliverHandler(order._id)}>Mark Delivered</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;