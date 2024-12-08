import React, { useState } from "react";
import { FaTrash, FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function OICList() {
  const [oicList, setOicList] = useState([
    { id: 1, idNumber: "OIC-2024-001", name: "Alice Johnson", office: "HR", role: "Office In-Charge" },
    { id: 2, idNumber: "OIC-2024-002", name: "Bob Smith", office: "Finance", role: "Office In-Charge" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [currentOIC, setCurrentOIC] = useState(null);
  const [isEnrollmentStarted, setIsEnrollmentStarted] = useState(false);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { isConnected, enrollmentStatus, startEnrollment } = useWebSocketContext();

  const handleRemove = (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this Office In-Charge?");
    if (confirmed) {
      setOicList(oicList.filter((oic) => oic.id !== id));
    }
  };

  const handleEnrollFingerprint = (oic) => {
    if (!isConnected) {
      alert('Cannot enroll fingerprint: Scanner is not connected');
      return;
    }
    setCurrentOIC(oic);
    setIsModalOpen(true);
  };

  const handleEnrollESignature = (oic) => {
    setCurrentOIC(oic);
    setIsSignatureModalOpen(true);
  };

  const startFingerprintEnrollment = () => {
    if (!currentOIC) return;
    
    setIsEnrollmentStarted(true);
    startEnrollment(currentOIC.id, currentOIC.name);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEnrollmentStarted(false);
    setCurrentOIC(null);
  };

  const closeSignatureModal = () => {
    setIsSignatureModalOpen(false);
    setCurrentOIC(null);
  };

  // Canvas drawing functions remain the same
  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Rest of the JSX remains the same, but update the enrollment modal to use the new status:
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="Company Logo" className="h-16" />
        <div className="flex items-center space-x-4">
          <div 
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
            title={isConnected ? 'Scanner Connected' : 'Scanner Disconnected'} 
          />
          <FaBell className="text-white text-xl" />
          <FaUserCircle className="text-white text-2xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Office In-Charge List</h2>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            {/* Table header and body remain the same */}
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">ID Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Office</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Enroll Fingerprint</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Enroll E-Signature</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {oicList.map((oic) => (
                <tr key={oic.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{oic.idNumber}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{oic.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{oic.office}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{oic.role}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className={`${isConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-2 py-1 rounded-lg`}
                      onClick={() => handleEnrollFingerprint(oic)}
                      disabled={!isConnected}
                    >
                      Enroll
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleEnrollESignature(oic)}
                    >
                      Enroll
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleRemove(oic.id)}
                    >
                      <FaTrash className="inline" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fingerprint Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enroll Fingerprint</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please place your finger on the scanner to enroll the fingerprint for <b>{currentOIC?.name}</b>.
            </p>
            {enrollmentStatus && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
                {enrollmentStatus}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              {!isEnrollmentStarted && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={startFingerprintEnrollment}
                >
                  Start Enrollment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* E-Signature Modal */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enroll E-Signature</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please draw your signature below for <b>{currentOIC?.name}</b>.
            </p>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border border-gray-300 w-full h-48 mb-4"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            ></canvas>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                onClick={clearCanvas}
              >
                Clear
              </button>
              <div className="space-x-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={closeSignatureModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={closeSignatureModal}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OICList;