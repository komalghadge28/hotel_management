import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerAdmin = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "admins", res.user.uid), {
        email,
        role: "admin",
        createdAt: new Date()
      });

      alert("Admin Registered Successfully");
      navigate("/admin/login");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #fff;
        }

        .full-screen-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          max-width: 450px;
          background: linear-gradient(145deg, #1c1c1c, #2a2a2a);
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          padding: 30px;
          text-align: center;
        }

        h2 {
          color: #ffcb05;
          margin-bottom: 25px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 15px;
          background-color: #333;
          color: #eee;
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          border: none;
          border-radius: 8px;
          background-color: #64ffda;
          color: #222;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover {
          background-color: #52cca7;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="full-screen-container">
        <div className="container">
          <h2>Admin Register</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={registerAdmin}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;