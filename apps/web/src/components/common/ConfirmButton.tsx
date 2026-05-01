import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmButton = ({ message, onConfirm, onCancel }: ConfirmProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // kasih waktu transisi masuk
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onCancel(), 200); // waktu sesuai durasi animasi
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-80 p-6 transform transition duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ border: "1px solid rgba(0,0,0,.06)" }}
      >
        <div className="flex justify-center mb-4">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: "#EF4444",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmButton;
