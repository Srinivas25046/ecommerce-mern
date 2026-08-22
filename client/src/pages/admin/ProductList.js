import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProductHandler = async () => {
    try {
      const { data } = await api.post("/products", {});
      window.location.href = `/admin/product/${data._id}/edit`;
    } catch (err) {
      setError("Could not create product");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError("Could not delete product");
      }
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <button onClick={createProductHandler}>+ Add Product</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`}>Edit</Link>
                  <button onClick={() => deleteHandler(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;