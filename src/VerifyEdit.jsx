import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function VerifyEdit() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const ref = doc(db, "bookings", bookingId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setBooking(snap.data());
        } else {
          alert("Booking not found");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleChange = (idx, field, value) => {
    const updated = [...booking.entries];
    updated[idx][field] = value;
    setBooking({ ...booking, entries: updated });
  };

  const handleArrivalChange = (idx, field, value) => {
    const updated = [...booking.entries];
    updated[idx].arrival[field] = value;
    setBooking({ ...booking, entries: updated });
  };

  const handleStayChange = (idx, field, value) => {
    const updated = [...booking.entries];
    updated[idx].stay[field] = value;
    setBooking({ ...booking, entries: updated });
  };

  const handlePhoneChange = (idx, value) => {
    const updated = [...booking.entries];
    updated[idx].phones = value.split(",").map((p) => p.trim());
    setBooking({ ...booking, entries: updated });
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "bookings", bookingId);
      await updateDoc(ref, {
        entries: booking.entries,
        updatedAt: serverTimestamp(),
      });
      alert("✅ All Changes Saved");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to Save Changes");
    }
  };

  const handleCheckout = (index) => {
    navigate(`/out-form/${bookingId}/${index}`);
  };

  if (loading) return <div className="loader">Loading Booking Data...</div>;
  if (!booking) return <div className="loader">No Data Found</div>;

  const isActive = booking.entries.length > 0;

  return (
    <div className={`verify-wrapper ${darkMode ? "dark" : "light"}`}>
      <style>{`
        .verify-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          transition: all 0.4s ease;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .verify-wrapper.dark { 
          background: radial-gradient(circle at top left, #1e293b, #0f172a); 
          color: #f1f5f9; 
        }
        .verify-wrapper.light { 
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%); 
          color: #0f172a; 
        }

        .container {
          width: 100%;
          max-width: 900px;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-card {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.6)'};
          backdrop-filter: blur(12px);
          padding: 30px;
          border-radius: 24px;
          border: 1px solid ${darkMode ? '#334155' : 'rgba(255,255,255,0.5)'};
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          flex-wrap: wrap;
          gap: 20px;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          margin-top: 10px;
          letter-spacing: 0.5px;
        }

        .guest-card {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)'};
          backdrop-filter: blur(8px);
          padding: 30px;
          border-radius: 20px;
          margin-bottom: 25px;
          border: 1px solid ${darkMode ? '#475569' : '#ffffff'};
          box-shadow: 0 8px 20px rgba(0,0,0,0.04);
        }

        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }

        .section-label { 
          font-size: 11px; 
          font-weight: 800; 
          color: #6366f1; 
          text-transform: uppercase; 
          margin-bottom: 12px;
          display: block;
          letter-spacing: 1px;
        }

        input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid ${darkMode ? '#475569' : '#94a3b8'};
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          color: inherit;
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus { border-color: #6366f1; outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2); }
        input:disabled { background: transparent; border-color: transparent; padding-left: 0; cursor: default; font-weight: 500; }

        .btn {
          padding: 10px 22px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .btn-back { background: transparent; border: 1.5px solid ${darkMode ? '#475569' : '#94a3b8'}; color: inherit; }
        .btn-toggle { background: ${darkMode ? '#f8fafc' : '#1e293b'}; color: ${darkMode ? '#0f172a' : '#ffffff'}; }
        .btn-edit { background: #6366f1; color: white; }
        .btn-save { background: #10b981; color: white; }
        .btn-checkout { 
          background: #f43f5e; 
          color: white; 
          width: 100%; 
          justify-content: center;
          margin-top: 25px;
          font-size: 15px;
          padding: 14px;
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .doc-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 12px;
          background: rgba(99, 102, 241, 0.15);
          border-radius: 8px;
          transition: 0.2s;
        }
        .doc-link:hover { background: rgba(99, 102, 241, 0.25); }

        .loader {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e2e8f0;
          color: #1e293b;
          font-size: 1.2rem;
          font-weight: 600;
        }
      `}</style>

      <div className="container">
        {/* HEADER SECTION */}
        <div className="header-card">
          <div>
            <button className="btn btn-back" onClick={() => navigate("/booking")} style={{marginBottom: '15px'}}>
              ← Back to Bookings
            </button>
            <h2 style={{ margin: 0, letterSpacing: '-0.5px' }}>Verification Dashboard</h2>
            <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '6px' }}>
              Reference: <span style={{fontWeight: 700}}>{bookingId.slice(-8).toUpperCase()}</span>
            </div>
            <span className="status-badge" style={{ 
              background: isActive ? '#bbf7d0' : '#fecaca', 
              color: isActive ? '#166534' : '#991b1b' 
            }}>
              {isActive ? "● Active Stay" : "○ Checked Out"}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button className="btn btn-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
            
            {/* Separate Save and Edit Buttons */}
            <button 
              className="btn btn-edit" 
              onClick={() => setEditMode(true)}
              style={{ display: editMode ? 'none' : 'flex' }}
            >
              ✏️ Edit Info
            </button>

            {editMode && (
              <>
                <button className="btn btn-save" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="btn btn-back" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* GUEST ENTRIES */}
        {booking.entries.map((entry, idx) => (
          <div key={idx} className="guest-card">
            <h4 style={{ 
              marginTop: 0, 
              borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, 
              paddingBottom: '12px',
              fontSize: '18px'
            }}>
              Guest Information #{idx + 1}
            </h4>

            <div className="section-box" style={{marginBottom: '25px'}}>
              <span className="section-label">Identity Details</span>
              <div className="grid-layout">
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>FULL NAME</label>
                  <input
                    value={entry.name}
                    disabled={!editMode}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>AGE</label>
                  <input
                    value={entry.age}
                    disabled={!editMode}
                    onChange={(e) => handleChange(idx, "age", e.target.value)}
                  />
                </div>
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>CONTACTS</label>
                  <input
                    value={entry.phones.join(", ")}
                    disabled={!editMode}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="section-box" style={{marginBottom: '25px'}}>
              <span className="section-label">Logistics</span>
              <div className="grid-layout">
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>NATIONALITY</label>
                  <input
                    value={entry.arrival.nationality}
                    disabled={!editMode}
                    onChange={(e) => handleArrivalChange(idx, "nationality", e.target.value)}
                  />
                </div>
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>ARRIVAL DATE</label>
                  <input
                    type={editMode ? "date" : "text"}
                    value={entry.arrival.arrivalDate}
                    disabled={!editMode}
                    onChange={(e) => handleArrivalChange(idx, "arrivalDate", e.target.value)}
                  />
                </div>
                <div>
                  <label style={{fontSize: '10px', fontWeight: 700, opacity: 0.6}}>ROOM NUMBER</label>
                  <input
                    value={entry.stay.roomNo}
                    disabled={!editMode}
                    onChange={(e) => handleStayChange(idx, "roomNo", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="section-box">
              <span className="section-label">Digital Documents</span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                {Object.entries(entry)
                  .filter(([key]) => key.endsWith("Url"))
                  .map(([key, value]) => (
                    <a key={key} href={value} target="_blank" rel="noreferrer" className="doc-link">
                      📎 {key.replace("Url", "").toUpperCase()}
                    </a>
                  ))}
              </div>
            </div>

            <button className="btn btn-checkout" onClick={() => handleCheckout(idx)}>
              Check-out Guest
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifyEdit;