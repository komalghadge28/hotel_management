import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function ManageUsers() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= FIRESTORE REF ================= */
  const usersRef = useMemo(() => collection(db, "users"), []);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getDocs(usersRef);
        setUsers(
          data.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (error) {
        console.error("Load Error:", error);
      }
    };
    fetchUsers();
  }, [usersRef]);

  /* ================= RELOAD ================= */
  const reloadUsers = async () => {
    try {
      const data = await getDocs(usersRef);
      setUsers(
        data.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (error) {
      console.error("Reload Error:", error);
    }
  };

  /* ================= SAVE USER ================= */
  const saveUser = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Enter Email and Password");
      return;
    }
    try {
      if (editId) {
        await updateDoc(doc(db, "users", editId), { email, password });
        alert("User Updated ✅");
      } else {
        await addDoc(usersRef, { email, password, createdAt: new Date() });
        alert("User Added ✅");
      }
      clearForm();
      reloadUsers();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Operation Failed ❌");
    }
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      alert("User Deleted ✅");
      reloadUsers();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete Failed ❌");
    }
  };

  /* ================= EDIT ================= */
  const editUser = (user) => {
    setEditId(user.id);
    setEmail(user.email);
    setPassword(user.password);
  };

  /* ================= CLEAR ================= */
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setEditId(null);
  };

  return (
    <div>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: #fff;
        }
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 25px;
          background: linear-gradient(145deg, #0f2027, #203a43);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          text-align: center;
        }
        h2 {
          color: #ffcb05;
          margin-bottom: 25px;
        }
        .back-btn {
          margin-bottom: 20px;
          padding: 8px 16px;
          cursor: pointer;
          background: #ff7675;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .back-btn:hover {
          background: #d63031;
          transform: translateY(-2px);
        }
        .form-box {
          margin-bottom: 25px;
        }
        input {
          width: 250px;
          padding: 8px 10px;
          margin: 5px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 14px;
        }
        button {
          padding: 8px 14px;
          cursor: pointer;
          border: none;
          background: #64ffda;
          color: #222;
          font-weight: 600;
          border-radius: 8px;
          margin: 5px;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #52cca7;
          transform: translateY(-2px);
        }
        .cancel-btn {
          background: #aaa;
          color: #222;
        }
        .delete-btn {
          background: #ff7675;
          color: #fff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: #1c1c1c;
          border-radius: 10px;
          overflow: hidden;
        }
        th, td {
          padding: 12px;
          text-align: center;
        }
        thead {
          background: #ff7675;
          color: #fff;
        }
        tbody tr:nth-child(even) {
          background: #2a2a2a;
        }
        tbody tr:hover {
          background: #52cca7;
          color: #222;
          transition: 0.3s;
        }
        .no-users {
          margin-top: 20px;
          font-style: italic;
          color: #ccc;
        }
      `}</style>

      <div className="container">
        <h2>Manage Users</h2>

        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ⬅ Back to Dashboard
        </button>

        <div className="form-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button onClick={saveUser}>{editId ? "Update User" : "Add User"}</button>
          {editId && (
            <button onClick={clearForm} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>

        <hr style={{ margin: "30px 0", borderColor: "#444" }} />

        <h3>All Users</h3>

        {users.length === 0 && <p className="no-users">No Users Found</p>}

        {users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.email}</td>
                  <td>{u.password}</td>
                  <td>
                    <button onClick={() => editUser(u)}>Edit</button>
                    <button onClick={() => deleteUser(u.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;