import { useState } from "react";
import { db } from "./firebase";
import { supabase } from "./supabase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Added for navigation

function EmployeeOutForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const [form, setForm] = useState({
    name: "",
    date: "",
    inTime: "",
    outTime: "",
    photo: null,
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const uploadPhoto = async (file) => {
    if (!file) return null;
    const fileName = `employee_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("employeeout")
      .upload(`register/${fileName}`, file);

    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("employeeout")
      .getPublicUrl(`register/${fileName}`);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const photoUrl = await uploadPhoto(form.photo);

      await addDoc(collection(db, "employeeOut"), {
        name: form.name,
        date: form.date,
        inTime: form.inTime,
        outTime: form.outTime,
        photoUrl,
        createdAt: serverTimestamp(),
      });

      alert("✅ Employee Out Saved Successfully");
      setForm({ name: "", date: "", inTime: "", outTime: "", photo: null });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to Submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-wrapper">
      <style>{`
        .employee-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at top right, #1e293b, #080c14);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .employee-card {
          width: 100%;
          max-width: 550px;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.5s ease-out;
          position: relative;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* NEW BACK BUTTON STYLE */
        .back-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-color: #3b82f6;
        }

        .header-area {
          text-align: center;
          margin-bottom: 30px;
        }

        .header-area h2 {
          font-size: 1.8rem;
          color: #f8fafc;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header-area p {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #3b82f6;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .input-style {
          width: 100%;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .input-style:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .time-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .file-upload-wrapper {
          position: relative;
          background: rgba(59, 130, 246, 0.05);
          border: 2px dashed rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: 0.3s;
        }

        .file-upload-wrapper:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          margin-top: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.5);
        }

        .submit-btn:disabled {
          background: #475569;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .employee-card { padding: 25px; }
          .time-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="employee-card">
        {/* Back to Dashboard Button */}
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>

        <div className="header-area">
          <h2>Employee Exit Log</h2>
          <p>Final Shift Clearance Record</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="input-style"
              type="text"
              placeholder="Enter Employee Name"
              value={form.name}
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Duty Date</label>
            <input
              className="input-style"
              type="date"
              value={form.date}
              required
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="time-grid">
            <div className="form-group">
              <label>Shift Start (In)</label>
              <input
                className="input-style"
                type="time"
                value={form.inTime}
                required
                onChange={(e) => handleChange("inTime", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Shift End (Out)</label>
              <input
                className="input-style"
                type="time"
                value={form.outTime}
                required
                onChange={(e) => handleChange("outTime", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Register Photo Verification</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleChange("photo", e.target.files[0])}
                style={{ color: '#94a3b8', fontSize: '14px' }}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "RECORDING EXIT..." : "CONFIRM FINAL OUT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeOutForm;