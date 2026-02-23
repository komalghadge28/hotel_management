import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Success ✅");
      navigate("/form");
    } catch (error) {
      alert("Login Failed ❌ " + error.message);
      console.log(error);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "25px",
    backgroundColor: "#222",
    color: "#f0f0f0",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.7)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center"
  };

  const headingStyle = {
    color: "#64ffda",
    marginBottom: "25px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "#eee",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    backgroundColor: "#64ffda",
    color: "#222",
    border: "none",
    borderRadius: "5px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Hotel Management Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button
        style={buttonStyle}
        onClick={handleLogin}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#52cca7")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#64ffda")}
      >
        Login
      </button>
    </div>
  );
}

export default Login;