import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome to ShopEasy</h1>
      <p>Best deals on electronics, fashion, home essentials and more.</p>

      <h2>Featured Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} width="150" />
              <h3>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </h3>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;