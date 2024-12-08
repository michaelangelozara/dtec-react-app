import React, { useState } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function OICManagement() {
  const [oics, setOics] = useState([
    {
      id: 1,
      idNumber: "OIC-001",
      name: "Gregorio del Pilar",
      position: "OIC Registrar",
      department: "Registrar's Office",
    },
    {
      id: 2,
      idNumber: "OIC-002",
      name: "Andres Bonifacio",
      position: "OIC Finance",
      department: "Finance Office",
    },
  ]);

  const handleEnrollFingerprint = (id) => {
    alert(`Enroll Fingerprint for OIC ID: ${id}`);
    // Implement enroll logic here
  };

  const handleEnrollSignature = (id) => {
    alert(`Enroll Signature for OIC ID: ${id}`);
    // Implement enroll logic here
  };

  const handleResetPassword = (id) => {
    alert(`Reset Password for OIC ID: ${id}`);
    // Implement reset logic here
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this OIC?");
    if (confirmed) {
      setOics(oics.filter((oic) => oic.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="DTEC Logo" className="h-16" />
        <div className="flex items-center space-x-4">
          <FaBell className="text-white text-xl" />
          <FaUserCircle className="text-white text-2xl" />
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">OIC Management</h2>
      </div>

      <div className="p-8">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">ID Number</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Position</th>
              <th className="border px-4 py-2 text-left">Department</th>
              <th className="border px-4 py-2 text-center">Enroll Fingerprint</th>
              <th className="border px-4 py-2 text-center">Enroll Signature</th>
              <th className="border px-4 py-2 text-center">Reset Password</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {oics.map((oic) => (
              <tr key={oic.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{oic.idNumber}</td>
                <td className="border px-4 py-2">{oic.name}</td>
                <td className="border px-4 py-2">{oic.position}</td>
                <td className="border px-4 py-2">{oic.department}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleEnrollFingerprint(oic.id)}
                  >
                    Enroll
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleEnrollSignature(oic.id)}
                  >
                    Enroll
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleResetPassword(oic.id)}
                  >
                    Reset
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleDelete(oic.id)}
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
  );
}

export default OICManagement;
