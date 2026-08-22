import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        setError("Could not load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
        name,
        price,
        image,
        category,
        countInStock,
        description,
      });
      navigate("/admin/products");
    } catch (err) {
      setError("Could not update product");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submitHandler}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div>
          <label>Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div>
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div>
          <label>Count In Stock</label>
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <button type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default ProductEdit;