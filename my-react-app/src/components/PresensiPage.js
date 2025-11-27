import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
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
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
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

  const handleCheckIn = async () => {
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
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || "Check-in berhasil");
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
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

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

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={loading || !coords}
            className={`w-full py-3 px-4 font-semibold rounded-md shadow-sm transition ${
              loading || !coords
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