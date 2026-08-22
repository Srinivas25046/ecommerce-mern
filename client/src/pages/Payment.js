import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError("Could not load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const payHandler = async () => {
    setError("");

    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Check your internet connection.");
      return;
    }

    setProcessing(true);

    try {
      const { data } = await api.post(`/payment/razorpay/order/${orderId}`);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopEasy",
        description: `Payment for Order #${orderId}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/payment/razorpay/verify", {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate("/myorders");
          } catch (err) {
            setError("Payment succeeded but verification failed.");
            setProcessing(false);
          }
        },
        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
        },
        theme: {
          color: "#e67e22",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment");
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h2>Payment</h2>
      <p>Test Mode — use card 5104 0155 5555 5558, any future expiry, any CVV.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>Order ID: {order._id}</p>
      <p>Items: ₹{order.itemsPrice}</p>
      <p>Shipping: ₹{order.shippingPrice}</p>
      <h3>Total: ₹{order.totalPrice}</h3>

      {order.isPaid ? (
        <p>This order has already been paid.</p>
      ) : (
        <button onClick={payHandler} disabled={processing}>
          {processing ? "Processing..." : `Pay ₹${order.totalPrice} with Razorpay`}
        </button>
      )}
    </div>
  );
};

export default Payment;