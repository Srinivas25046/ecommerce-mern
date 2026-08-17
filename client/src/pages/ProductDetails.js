import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, Number(qty));
    navigate("/cart");
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <img src={product.image} alt={product.name} width="300" />
      <h2>{product.name}</h2>
      <p>Category: {product.category}</p>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <p>
        Status: {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
      </p>

      {product.countInStock > 0 && (
        <div>
          <label>Qty: </label>
          <select value={qty} onChange={(e) => setQty(e.target.value)}>
            {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <button disabled={product.countInStock === 0} onClick={addToCartHandler}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;