import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/products">Go shopping</Link>
        </p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
              <img src={item.image} alt={item.name} width="60" />
              <Link to={`/product/${item._id}`}>{item.name}</Link>
              <p>₹{item.price}</p>

              <select
                value={item.qty}
                onChange={(e) => addToCart(item, Number(e.target.value))}
              >
                {[...Array(item.countInStock).keys()].slice(0, 10).map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>

              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}

          <h3>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items): ₹{totalPrice}</h3>
          <button onClick={checkoutHandler}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;