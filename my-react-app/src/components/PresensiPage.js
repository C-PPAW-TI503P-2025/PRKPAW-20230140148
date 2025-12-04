import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Webcam from "react-webcam"; // Diperlukan untuk mengakses kamera
import "leaflet/dist/leaflet.css";

// Fix untuk marker icon di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null); // {lat, lng}
  
  // State dan Ref untuk Kamera (sesuai modul)
  const [image, setImage] = useState(null); // Menyimpan data gambar (Base64 string)
  const webcamRef = useRef(null);
  
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  // Fungsi untuk mengambil foto dari webcam (sesuai modul)
  const capture = useCallback(() => {
    // getScreenshot() mengembalikan gambar sebagai Base64 string
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  
  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    // ... (kode getLocation tetap sama) ...
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // UPDATE: Fungsi Check-in untuk mengirim FormData (lokasi + foto)
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) { // Tambahkan validasi foto
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }
    
    try {
      // 1. Konversi Base64 (image) ke Blob (sesuai modul)
      const blob = await (await fetch(image)).blob();

      // 2. Buat FormData (sesuai modul)
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      // 'image' harus cocok dengan nama field yang diterima Multer di backend (upload.single('image'))
      formData.append('image', blob, 'selfie.jpg'); 

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // Penting: Browser akan otomatis menambahkan 'Content-Type: multipart/form-data'
          // saat mengirim objek FormData, jadi tidak perlu diset manual.
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData, // Kirim FormData, bukan objek JSON
        config
      );

      setMessage(response.data.message || "Check-in berhasil");
      setImage(null); // Reset foto setelah berhasil check-in
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Check-in gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  // Catatan: handleCheckOut tidak memerlukan foto, jadi tidak perlu diubah ke FormData
  const handleCheckOut = async () => {
    setError("");
    setMessage("");
    
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Mengirim JSON (sesuai sebelumnya) karena tidak ada file yang diunggah
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || "Check-out berhasil");
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Check-out gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>

        {/* Peta Lokasi */}
        {/* ... (kode Peta Lokasi tetap sama) ... */}
        {coords && (
          <div className="mb-6 border rounded-lg overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>
                  Lokasi Presensi Anda
                  <br />
                  Lat: {coords.lat.toFixed(6)}
                  <br />
                  Lng: {coords.lng.toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Koordinat Display */}
        {coords && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-700 text-sm">
              <strong>Lokasi Anda:</strong> {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
          </div>
        )}

        {message && (
          <p className="text-green-600 mb-4 p-3 bg-green-50 rounded">{message}</p>
        )}
        {error && (
          <p className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</p>
        )}
        
        {/* TAMBAHAN: Tampilan Kamera (sesuai modul) */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>
        
        {/* TAMBAHAN: Tombol Capture/Retake (sesuai modul) */}
        <div className="mb-4">
          {!image ? (
            <button onClick={capture} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Ambil Foto 📸
            </button>
          ) : (
            <button onClick={() => setImage(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
              Foto Ulang 🔄
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            // Disabled jika loading, lokasi belum ada, ATAU foto belum diambil
            disabled={loading || !coords || !image} 
            className={`w-full py-3 px-4 font-semibold rounded-md shadow-sm transition ${
              loading || !coords || !image
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Memproses..." : "Check-In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading || !coords}
            className={`w-full py-3 px-4 font-semibold rounded-md shadow-sm transition ${
              loading || !coords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? "Memproses..." : "Check-Out"}
          </button>
        </div>

        {!coords && (
          <button
            onClick={getLocation}
            className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Dapatkan Ulang Lokasi
          </button>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;