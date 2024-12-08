import React, { useState, useRef } from "react";
import { FaEdit, FaTrash, FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function OfficerList() {
  const [officers, setOfficers] = useState([
    {
      id: 1,
      idNumber: "2024-001",
      name: "Christian James Torres",
      courseYear: "BSCS 4th Year",
      club: "Coding Club",
      role: "President",
    },
    {
      id: 2,
      idNumber: "2024-002",
      name: "Michael Angelo Zara",
      courseYear: "BSCS 3rd Year",
      club: "Robotics Club",
      role: "Treasurer",
    },
    {
      id: 3,
      idNumber: "2024-003",
      name: "Joshua Lazaro",
      courseYear: "BSCS 4th Year",
      club: "Web Developers Club",
      role: "Secretary",
    },
  ]);

  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Common Handlers
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this officer?");
    if (confirmed) {
      setOfficers(officers.filter((officer) => officer.id !== id));
    }
  };

  const handleEdit = (officer) => {
    setSelectedOfficer({ ...officer });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setOfficers(officers.map((o) => (o.id === selectedOfficer.id ? selectedOfficer : o)));
    setIsEditModalOpen(false);
  };

  // Fingerprint Handlers
  const handleEnrollFingerprint = (officer) => {
    setSelectedOfficer(officer);
    setIsFingerprintModalOpen(true);
  };

  const closeFingerprintModal = () => {
    setIsFingerprintModalOpen(false);
    setSelectedOfficer(null);
  };

  // Signature Handlers
  const handleEnrollESignature = (officer) => {
    setSelectedOfficer(officer);
    setIsSignatureModalOpen(true);
  };

  const closeSignatureModal = () => {
    setIsSignatureModalOpen(false);
    setSelectedOfficer(null);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="DTEC Logo" className="h-16" />
        <div className="flex items-center space-x-4">
          <FaBell className="text-white text-xl" />
          <FaUserCircle className="text-white text-2xl" />
        </div>
      </div>

      {/* Heading */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">List of Officers</h2>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID Number</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Course & Year</th>
                <th className="border border-gray-300 px-4 py-2">Club</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Enroll Fingerprint</th>
                <th className="border border-gray-300 px-4 py-2">Enroll E-Signature</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer) => (
                <tr key={officer.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{officer.idNumber}</td>
                  <td className="border px-4 py-2">{officer.name}</td>
                  <td className="border px-4 py-2">{officer.courseYear}</td>
                  <td className="border px-4 py-2">{officer.club}</td>
                  <td className="border px-4 py-2">{officer.role}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEnrollFingerprint(officer)}
                    >
                      Enroll
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEnrollESignature(officer)}
                    >
                      Enroll
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(officer)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(officer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fingerprint Modal */}
      {isFingerprintModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enroll Fingerprint</h2>
            <p>Enroll fingerprint for <b>{selectedOfficer?.name}</b>.</p>
            <div className="h-20 w-20 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto my-4">
              <span className="text-gray-500 text-xs">Scan Here</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeFingerprintModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={closeFingerprintModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enroll E-Signature</h2>
            <p>Please draw the signature for <b>{selectedOfficer?.name}</b>.</p>
            <canvas
              ref={canvasRef}
              className="border border-gray-300 w-full h-48 my-4"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={clearCanvas}
              >
                Clear
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeSignatureModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={closeSignatureModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerList;
