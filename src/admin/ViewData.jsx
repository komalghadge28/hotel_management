import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ViewData() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [loading, setLoading] = useState(false);

  /* ================= FIRESTORE REF ================= */
  const formsRef = useMemo(() => collection(db, "hotelForms"), []);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(formsRef);
        setData(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [formsRef]);

  /* ================= HANDLE SEARCH TYPE ================= */
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearch("");
  };

  /* ================= FILTER DATA ================= */
  const filteredData = data.filter((d) => {
    if (!search) return true;
    if (searchType === "name") return d.name?.toLowerCase().includes(search.toLowerCase());
    if (searchType === "phone") return d.phone?.includes(search);
    if (searchType === "date") return d.arrivalDate?.includes(search);
    return true;
  });

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
          max-width: 1200px;
          margin: 40px auto;
          padding: 20px;
          background: linear-gradient(145deg, #0f2027, #203a43);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        h2 {
          text-align: center;
          color: #ffcb05;
          margin-bottom: 30px;
        }
        .top-bar {
          margin-bottom: 20px;
          text-align: center;
        }
        .back-btn {
          padding: 8px 15px;
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
        .search-box {
          margin-bottom: 20px;
          text-align: center;
        }
        select, input {
          padding: 8px 12px;
          margin: 5px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
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
          background: #ff7675;
          color: #fff;
          transition: 0.3s;
        }
        .loading, .no-data {
          text-align: center;
          font-weight: bold;
          margin: 20px 0;
        }
        .documents-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .document-img {
          width: 80px;
          margin: 3px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
      `}</style>

      <div className="container">
        <div className="top-bar">
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ⬅ Back to Dashboard
          </button>
        </div>

        <h2>All Hotel Forms</h2>

        <div className="search-box">
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="name">Search by Name</option>
            <option value="phone">Search by Register / Phone</option>
            <option value="date">Search by Date</option>
          </select>
          <input
            placeholder={
              searchType === "name"
                ? "Enter Name"
                : searchType === "phone"
                ? "Enter Phone"
                : "YYYY-MM-DD"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="loading">Loading data...</p>}

        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Nationality</th>
                <th>Arrival Date</th>
                <th>Arrival Time</th>
                <th>Location</th>
                <th>Stay Type</th>
                <th>Room No</th>
                <th>Days</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="13" className="no-data">No Records Found</td>
                </tr>
              )}
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.age}</td>
                  <td>{d.gender}</td>
                  <td>{d.phone}</td>
                  <td>{d.email}</td>
                  <td>{d.nationality}</td>
                  <td>{d.arrivalDate}</td>
                  <td>{d.arrivalTime}</td>
                  <td>{d.location}</td>
                  <td>{d.stayType}</td>
                  <td>{d.roomNo}</td>
                  <td>{d.days}</td>
                  <td>
                    <div className="documents-container">
                      {d.aadharUrl && <img src={d.aadharUrl} alt="Aadhar" className="document-img" />}
                      {d.panUrl && <img src={d.panUrl} alt="PAN" className="document-img" />}
                      {d.licenseUrl && <img src={d.licenseUrl} alt="License" className="document-img" />}
                      {d.passportUrl && <img src={d.passportUrl} alt="Passport" className="document-img" />}
                      {d.photoUrl && <img src={d.photoUrl} alt="Register Photo" className="document-img" />}
                    </div>
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

export default ViewData;