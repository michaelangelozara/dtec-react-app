import React, { useState } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function PersonnelManagement() {
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      idNumber: "P-001",
      name: "Maria Clara Reyes",
      club: "Literature Club",
      position: "President",
    },
    {
      id: 2,
      idNumber: "P-002",
      name: "Juan dela Cruz",
      club: "Drama Club",
      position: "Member",
    },
  ]);

  const handleResetPassword = (id) => {
    alert(`Reset Password for Personnel ID: ${id}`);
    // Implement reset logic here
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this personnel?");
    if (confirmed) {
      setPersonnel(personnel.filter((person) => person.id !== id));
    }
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

      {/* Page Title */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Personnel Management</h2>
      </div>

      {/* Personnel Table */}
      <div className="p-8">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">ID Number</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Club</th>
              <th className="border px-4 py-2 text-left">Position</th>
              <th className="border px-4 py-2 text-center">Reset Password</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{person.idNumber}</td>
                <td className="border px-4 py-2">{person.name}</td>
                <td className="border px-4 py-2">{person.club}</td>
                <td className="border px-4 py-2">{person.position}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleResetPassword(person.id)}
                  >
                    Reset
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleDelete(person.id)}
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

export default PersonnelManagement;
