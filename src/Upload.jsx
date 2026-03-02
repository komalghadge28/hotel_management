import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

// ⚠️ Must match Supabase folders exactly
const documentTypes = ["aadhar", "license", "PAN", "passport", "register"];

function Upload() {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ==============================
     FILE SELECT
  ============================== */
  const handleFileChange = (type, file) => {
    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  /* ==============================
     UPLOAD + GET PUBLIC URL
  ============================== */
  const uploadFile = async (file, folder) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;

    // Upload
    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: false });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* ==============================
     HANDLE UPLOAD
  ============================== */
  const handleUpload = async () => {
    if (Object.keys(files).length === 0) {
      alert("Please select at least one file");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = {};

      // Upload all files
      for (let type of documentTypes) {
        const file = files[type];

        if (!file) continue;

        const url = await uploadFile(file, type);

        if (!url) {
          alert(`Upload failed for ${type}`);
          setLoading(false);
          return;
        }

        uploadedUrls[type] = url;
      }

      console.log("Uploaded URLs:", uploadedUrls);

      alert("Upload Successful ✅");

      setFiles({});

      // You can save uploadedUrls in Firestore later if needed

      navigate("/view-documents");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     UI
  ============================== */
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Documents</h2>

      {documentTypes.map((type) => (
        <div key={type} style={styles.card}>
          <h4 style={styles.label}>{type}</h4>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(type, e.target.files[0])
            }
          />

          {files[type] && (
            <img
              src={URL.createObjectURL(files[type])}
              alt="preview"
              style={styles.preview}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default Upload;

/* ==============================
   STYLES
============================== */

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
  },

  card: {
    background: "#334155",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  label: {
    marginBottom: "8px",
  },

  preview: {
    width: "120px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "2px solid white",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};