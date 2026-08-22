import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="admin-dashboard-links">
    <div>
      <Link to="/admin/products">Manage Products</Link>
    </div>
    <div>
      <Link to="/admin/orders">Manage Orders</Link>
    </div>
</div>
    </div>
  );
};

export default Dashboard;