import { useState } from "react";
import { supabase } from "./supabase";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function MultiStepForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [persons, setPersons] = useState([
    { name: "", age: "", email: "", gender: "", phones: [""] },
  ]);

  const [arrival, setArrival] = useState({
    nationality: "",
    arrivalDate: "",
    arrivalTime: "",
    location: "",
  });

  const [stay, setStay] = useState({
    stayType: "",
    roomNo: "",
    days: "",
  });

  const [documents, setDocuments] = useState({
    aadhar: null,
    pan: null,
    license: null,
    passport: null,
    photo: null,
  });

  /* ---------------- TIME FORMAT (12 HOUR) ---------------- */
  const formatTime12Hour = (value) => {
    if (!value) return "";
    let [hours, minutes] = value.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  /* ---------------- HANDLERS ---------------- */
  const handlePersonChange = (idx, field, value) => {
    const updated = [...persons];
    updated[idx][field] = value;
    setPersons(updated);
  };

  const handlePhoneChange = (pIdx, phoneIdx, value) => {
    const updated = [...persons];
    updated[pIdx].phones[phoneIdx] = value;
    setPersons(updated);
  };

  const addPerson = () => {
    setPersons([
      ...persons,
      { name: "", age: "", email: "", gender: "", phones: [""] },
    ]);
  };

  const removePerson = (idx) => {
    setPersons(persons.filter((_, i) => i !== idx));
  };

  const addPhone = (pIdx) => {
    const updated = [...persons];
    updated[pIdx].phones.push("");
    setPersons(updated);
  };

  const removePhone = (pIdx, phoneIdx) => {
    const updated = [...persons];
    updated[pIdx].phones.splice(phoneIdx, 1);
    setPersons(updated);
  };

  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });

    if (error) return null;
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 3600);

    return data?.signedUrl || null;
  };

  const submitForm = async () => {
    setLoading(true);
    setMessage("");
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      const aadharUrl = await uploadFile(documents.aadhar, "aadhar");
      const panUrl = await uploadFile(documents.pan, "pan");
      const licenseUrl = await uploadFile(documents.license, "license");
      const passportUrl = await uploadFile(documents.passport, "passport");
      const photoUrl = await uploadFile(documents.photo, "register");

      const docRef = await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        entries: persons.map((person) => ({
          ...person,
          arrival,
          stay,
          aadharUrl,
          panUrl,
          licenseUrl,
          passportUrl,
          photoUrl,
        })),
        status: "active",
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Booking Submitted Successfully!");
      setTimeout(() => navigate(`/verify-edit/${docRef.id}`), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Submission Failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-wrapper">
      <style>{`
        /* Forces the wrapper to take full screen width and center content */
        .form-wrapper {
          font-family: 'Segoe UI', sans-serif;
          background-color: #1a1a1a;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 0;
          position: absolute;
          left: 0;
          top: 0;
          overflow-x: hidden;
        }

        .container {
          width: 90%;
          max-width: 850px;
          background: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          margin: 0 auto;
        }

        h2 { 
          text-align: center; 
          color: #1e293b; 
          font-size: 2.4rem; 
          font-weight: 800;
          margin-bottom: 40px;
        }

        h3 { 
          border-left: 5px solid #3b82f6; 
          padding-left: 15px; 
          margin: 40px 0 20px; 
          color: #334155;
          font-size: 1.5rem;
        }

        .person-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          background: #f8fafc;
        }

        .grid-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label { 
          font-size: 12px; 
          font-weight: 700; 
          color: #64748b; 
          text-transform: uppercase;
        }

        input, select {
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Target placeholder specifically for phone inputs */
        .phone-input::placeholder {
          font-size: 12px;
          color: #94a3b8;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-add { background: #3b82f6; color: white; margin-top: 10px; }
        .btn-add:hover { background: #2563eb; }

        .btn-remove { background: #fee2e2; color: #ef4444; }
        .btn-remove:hover { background: #fecaca; }

        .btn-secondary { background: #334155; color: white; width: 100%; margin-bottom: 20px;}
        
        .btn-submit {
          width: 100%;
          padding: 20px;
          background: #10b981;
          color: white;
          font-size: 1.2rem;
          margin-top: 40px;
        }

        .btn-submit:hover { background: #059669; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .container { padding: 20px; width: 95%; }
          .grid-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <h2>Room Booking</h2>

        {message && (
          <div style={{ 
            padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center',
            backgroundColor: message.includes("❌") ? "#fee2e2" : "#dcfce7",
            color: message.includes("❌") ? "#b91c1c" : "#15803d"
          }}>
            {message}
          </div>
        )}

        <h3>Guest Information</h3>
        {persons.map((person, idx) => (
          <div key={idx} className="person-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>Guest #{idx + 1}</h4>
              {persons.length > 1 && (
                <button className="btn btn-remove" onClick={() => removePerson(idx)}>Remove</button>
              )}
            </div>

            <div className="grid-row">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  placeholder="Full Name"
                  value={person.name}
                  onChange={(e) => handlePersonChange(idx, "name", e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input
                  placeholder="Age"
                  type="number"
                  value={person.age}
                  onChange={(e) => handlePersonChange(idx, "age", e.target.value)}
                />
              </div>
            </div>

            <div className="grid-row">
              <div className="input-group">
                <label>Email</label>
                <input
                  placeholder="Email"
                  type="email"
                  value={person.email}
                  onChange={(e) => handlePersonChange(idx, "email", e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select value={person.gender} onChange={(e) => handlePersonChange(idx, "gender", e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Phone Numbers</label>
              {person.phones.map((phone, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    className="phone-input"
                    style={{ flex: "0 1 300px" }} // Decreased size/width specifically here
                    placeholder="Phone number" // Smaller wording
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, pIdx, e.target.value)}
                  />
                  {person.phones.length > 1 && (
                    <button className="btn btn-remove" onClick={() => removePhone(idx, pIdx)}>✕</button>
                  )}
                </div>
              ))}
              <button className="btn btn-add" style={{ width: 'fit-content' }} onClick={() => addPhone(idx)}>+ Add Phone</button>
            </div>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={addPerson}>+ Add Another Guest</button>

        <h3>Travel Details</h3>
        <div className="grid-row">
          <div className="input-group">
            <label>Arrival Date</label>
            <input type="date" value={arrival.arrivalDate} onChange={(e) => setArrival({...arrival, arrivalDate: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Arrival Time</label>
            <input type="time" onChange={(e) => setArrival({...arrival, arrivalTime: formatTime12Hour(e.target.value)})} />
          </div>
        </div>
        
        <div className="grid-row">
          <div className="input-group">
            <label>Stay Type</label>
            <input placeholder="Personal/Business" value={stay.stayType} onChange={(e) => setStay({...stay, stayType: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Duration (Days)</label>
            <input type="number" placeholder="No. of days" value={stay.days} onChange={(e) => setStay({...stay, days: e.target.value})} />
          </div>
        </div>

        <h3>Documents</h3>

<div className="grid-row">
  {["aadhar", "pan", "license", "passport", "photo"].map((field) => (
    <div key={field} className="input-group">

      <label>{field}</label>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >

        {/* File Picker */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setDocuments({ ...documents, [field]: e.target.files[0] })
          }
        />

        {/* Hidden Camera Input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          id={`camera-${field}`}
          onChange={(e) =>
            setDocuments({ ...documents, [field]: e.target.files[0] })
          }
        />

        {/* Camera Button */}
        <label
          htmlFor={`camera-${field}`}
          style={{
            cursor: "pointer",
            padding: "8px 14px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          📷 Camera
        </label>

      </div>

    </div>
  ))}
</div>

        <button className="btn btn-submit" disabled={loading} onClick={submitForm}>
          {loading ? "Processing..." : "Submit Booking"}
        </button>
      </div>
    </div>
  );
}

export default MultiStepForm;