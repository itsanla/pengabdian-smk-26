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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        className={`bg-white p-4 rounded-lg shadow w-72 transform transition duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex justify-center mb-3">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <p className="text-center text-sm mb-4">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Ya
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmButton;
