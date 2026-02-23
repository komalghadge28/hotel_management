import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    aadhar: null,
    pan: null,
    license: null,
    passport: null,
    photo: null,
  });

  const phoneNumber = localStorage.getItem("userPhone"); // must be saved during form submit

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    // 150KB LIMIT
    if (file.size > 150 * 1024) {
      alert("File must be under 150KB");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  /* ================= UPLOAD FUNCTION ================= */

  const uploadFile = async (file, folder) => {
    const fileName = `${phoneNumber}_${folder}_${Date.now()}`;

    const { error } = await supabase.storage
      .from("vacation") // your bucket name
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage
      .from("vacation")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      alert("Phone not found. Please fill form again.");
      return;
    }

    try {
      const aadhar_url = await uploadFile(files.aadhar, "aadhar");
      const pan_url = await uploadFile(files.pan, "pan");
      const license_url = await uploadFile(files.license, "license");
      const passport_url = await uploadFile(files.passport, "passport");
      const photo_url = await uploadFile(files.photo, "photo");

      await supabase.from("documents").insert([
        {
          user_id: phoneNumber,
          aadhar_url,
          pan_url,
          license_url,
          passport_url,
          photo_url,
          document_status: "Pending",
        },
      ]);

      alert("Documents Uploaded Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 30 }}>
      <h2>Upload Documents</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Aadhar Card</label>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, "aadhar")} />
        </div>

        <div>
          <label>PAN Card</label>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, "pan")} />
        </div>

        <div>
          <label>Driving License</label>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, "license")} />
        </div>

        <div>
          <label>Passport</label>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, "passport")} />
        </div>

        <div>
          <label>Register Photo (Camera)</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e, "photo")}
          />
        </div>

        <br />

        <button type="submit">Submit</button>
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>

      </form>
    </div>
  );
}

export default Upload;