import { useState } from "react";
import { supabase } from "./supabase";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function MultiStepForm({ userId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    nationality: "",
    arrivalDate: "",
    arrivalTime: "",
    location: "",
    stayType: "",
    roomNo: "",
    days: ""
  });

  // Document files
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [license, setLicense] = useState(null);
  const [passport, setPassport] = useState(null);
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (fileSetter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 150 * 1024) {
      alert("File size must be 150 KB or less!");
      return;
    }
    fileSetter(file);
  };

  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const fileName = `${userId || "user"}_${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });
    if (error) {
      console.error(`${folder} upload error:`, error.message);
      return null;
    }
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 3600);
    return data?.signedUrl || null;
  };

  const submitForm = async () => {
    setLoading(true);
    setMessage("");
    try {
      const aadharUrl = await uploadFile(aadhar, "aadhar");
      const panUrl = await uploadFile(pan, "pan");
      const licenseUrl = await uploadFile(license, "license");
      const passportUrl = await uploadFile(passport, "passport");
      const photoUrl = await uploadFile(photo, "photo");

      await addDoc(collection(db, "hotelForms"), {
        ...form,
        aadharUrl,
        panUrl,
        licenseUrl,
        passportUrl,
        photoUrl,
        document_status: "Pending",
        createdAt: serverTimestamp()
      });

      setMessage("✅ Form submitted successfully!");
      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        nationality: "",
        arrivalDate: "",
        arrivalTime: "",
        location: "",
        stayType: "",
        roomNo: "",
        days: ""
      });
      setAadhar(null);
      setPan(null);
      setLicense(null);
      setPassport(null);
      setPhoto(null);
      setStep(1);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit form. Please try again.");
    }
    setLoading(false);
  };

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
          max-width: 450px;
          margin: 50px auto;
          background: linear-gradient(145deg, #1c92d2, #f2fcfe);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
          color: #111;
        }
        h2 {
          text-align: center;
          color: #ffcb05;
          margin-bottom: 20px;
          font-size: 26px;
        }
        h3 {
          color: #00b894;
          margin-bottom: 15px;
          font-size: 20px;
        }
        input, select {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border-radius: 8px;
          border: 1px solid #888;
          background-color: #f0f8ff;
          color: #111;
          font-size: 15px;
          box-sizing: border-box;
        }
        label {
          font-weight: 600;
          display: block;
          margin-top: 12px;
          color: #0984e3;
        }
        .btn {
          background-color: #ff7675;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          margin-right: 10px;
          margin-top: 15px;
          transition: 0.3s;
        }
        .btn:hover {
          background-color: #d63031;
        }
        .btn:disabled {
          background-color: #b2bec3;
          cursor: not-allowed;
        }
        .message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }
        .success { background-color: #00b894; color: white; }
        .error { background-color: #d63031; color: white; }
      `}</style>

      <div className="container">
        <h2>Hotel Document System</h2>
        {message && (
          <p className={`message ${message.includes("❌") ? "error" : "success"}`}>
            {message}
          </p>
        )}

        {step === 1 && (
          <div>
            <h3>Personal Details</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <button className="btn" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Arrival Details</h3>
            <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} />
            <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} />
            <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <button className="btn" onClick={() => setStep(1)}>Back</button>
            <button className="btn" onClick={() => setStep(3)}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Stay Details</h3>
            <input name="stayType" placeholder="Stay Type" value={form.stayType} onChange={handleChange} />
            <input name="roomNo" placeholder="Room No" value={form.roomNo} onChange={handleChange} />
            <input name="days" placeholder="No of Days" value={form.days} onChange={handleChange} />
            <button className="btn" onClick={() => setStep(2)}>Back</button>
            <button className="btn" onClick={() => setStep(4)}>Next</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Upload Documents</h3>
            {["Aadhar Card", "PAN Card", "Driving License", "Passport", "Register Photo"].map((doc, idx) => {
              const setter = [setAadhar, setPan, setLicense, setPassport, setPhoto][idx];
              return (
                <div key={doc}>
                  <label>{doc}</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile(setter)}
                  />
                </div>
              );
            })}
            <button className="btn" disabled={loading} onClick={submitForm}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button className="btn" onClick={() => setStep(3)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiStepForm;