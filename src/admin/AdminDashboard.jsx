import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #0f2027;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          padding: 30px;
          background: linear-gradient(145deg, #1c92d2, #f2fcfe);
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.5);
          color: #111;
          text-align: center;
        }
        h2 {
          color: #ffcb05;
          margin-bottom: 30px;
          font-size: 28px;
        }
        .nav {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
        }
        .nav-link {
          text-decoration: none;
          color: #fff;
          padding: 12px 20px;
          border-radius: 10px;
          background: #ff7675;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .nav-link:hover {
          background: #d63031;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.4);
        }
      `}</style>

      <div className="container">
        <h2>Admin Dashboard</h2>
        <nav className="nav">
          <Link to="/admin/users" className="nav-link">Manage Users</Link>
          <Link to="/admin/data" className="nav-link">View Forms</Link>
        </nav>
      </div>
    </div>
  );
}

export default AdminDashboard;