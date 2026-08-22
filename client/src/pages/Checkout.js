import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: "Razorpay",
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Shipping Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submitHandler}>
        <div>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>Postal Code</label>
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div>
          <label>Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>

        <div>
          <p>Items: ₹{itemsPrice}</p>
          <p>Shipping: ₹{shippingPrice}</p>
          <h3>Total: ₹{totalPrice}</h3>
        </div>

        <button type="submit">Continue to Payment</button>
      </form>
    </div>
  );
};

export default Checkout;