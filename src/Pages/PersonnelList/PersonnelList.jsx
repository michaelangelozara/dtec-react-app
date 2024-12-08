import React, { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function PersonnelList() {
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      idNumber: "P-2024-001",
      name: "John Doe",
      role: "Personnel",
      departmentalClub: { name: "N/A", position: "N/A" },
      socialClub: { name: "N/A", position: "N/A" },
    },
    {
      id: 2,
      idNumber: "P-2024-002",
      name: "Jane Smith",
      role: "Moderator",
      departmentalClub: { name: "N/A", position: "N/A" },
      socialClub: { name: "Gaming Club", position: "Moderator" },
    },
  ]);

  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this personnel?"
    );
    if (confirmed) {
      setPersonnel(personnel.filter((person) => person.id !== id));
    }
  };

  const handleView = (person) => {
    setSelectedPersonnel(person);
    setIsViewModalOpen(true);
  };

  const handleEdit = (person) => {
    setSelectedPersonnel({ ...person });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setPersonnel(
      personnel.map((p) => (p.id === selectedPersonnel.id ? selectedPersonnel : p))
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="Company Logo" className="h-16" />
        <div className="flex items-center space-x-4">
          <FaBell className="text-white text-xl" />
          <FaUserCircle className="text-white text-2xl" />
        </div>
      </div>

      {/* Heading */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          List of Personnel
        </h2>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  ID Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Departmental Club
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Departmental Position
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Social Club
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Social Position
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr key={person.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.idNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.departmentalClub.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.departmentalClub.position}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.socialClub.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {person.socialClub.position}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleView(person)}
                    >
                      <FaEye className="inline" /> View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleEdit(person)}
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleDelete(person.id)}
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">View Personnel</h3>
            <p>
              <span className="font-bold">ID Number:</span> {selectedPersonnel.idNumber}
            </p>
            <p>
              <span className="font-bold">Name:</span> {selectedPersonnel.name}
            </p>
            <p>
              <span className="font-bold">Role:</span> {selectedPersonnel.role}
            </p>
            <p>
              <span className="font-bold">Departmental Club:</span> {selectedPersonnel.departmentalClub.name} (
              {selectedPersonnel.departmentalClub.position})
            </p>
            <p>
              <span className="font-bold">Social Club:</span> {selectedPersonnel.socialClub.name} (
              {selectedPersonnel.socialClub.position})
            </p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

     {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-semibold mb-4">Edit Personnel</h3>

      {/* Name */}
      <label className="block mb-2">
        <span className="font-bold">Name:</span>
        <input
          type="text"
          className="border p-2 w-full"
          value={selectedPersonnel.name}
          onChange={(e) =>
            setSelectedPersonnel({ ...selectedPersonnel, name: e.target.value })
          }
        />
      </label>

      {/* Role */}
      <label className="block mb-2">
        <span className="font-bold">Role:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.role}
          onChange={(e) =>
            setSelectedPersonnel({ ...selectedPersonnel, role: e.target.value })
          }
        >
          <option>Personnel</option>
          <option>Moderator</option>
        </select>
      </label>

      {/* Departmental Club */}
      <label className="block mb-2">
        <span className="font-bold">Departmental Club:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.departmentalClub?.name || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              departmentalClub: {
                ...selectedPersonnel.departmentalClub,
                name: e.target.value,
              },
            })
          }
        >
          <option value="">N/A</option>
          <option>Engineering Club</option>
          <option>Design Club</option>
          <option>Marketing Club</option>
        </select>
      </label>

      {/* Departmental Club Position */}
      <label className="block mb-2">
        <span className="font-bold">Departmental Position:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.departmentalClub?.position || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              departmentalClub: {
                ...selectedPersonnel.departmentalClub,
                position: e.target.value,
              },
            })
          }
        >
          <option value="">N/A</option>
          <option>Moderator</option>
        </select>
      </label>

      {/* Social Club 1 */}
      <label className="block mb-2">
        <span className="font-bold">Social Club 1:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.socialClubs?.[0]?.name || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              socialClubs: [
                { ...selectedPersonnel.socialClubs?.[0], name: e.target.value },
                selectedPersonnel.socialClubs?.[1] || {},
              ],
            })
          }
        >
          <option value="">N/A</option>
          <option>Sports Club</option>
          <option>Music Club</option>
          <option>Art Club</option>
        </select>
      </label>

      {/* Social Club 1 Position */}
      <label className="block mb-2">
        <span className="font-bold">Position 1:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.socialClubs?.[0]?.position || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              socialClubs: [
                { ...selectedPersonnel.socialClubs?.[0], position: e.target.value },
                selectedPersonnel.socialClubs?.[1] || {},
              ],
            })
          }
        >
          <option value="">N/A</option>
          <option>Moderator</option>
        </select>
      </label>

      {/* Social Club 2 */}
      <label className="block mb-2">
        <span className="font-bold">Social Club 2:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.socialClubs?.[1]?.name || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              socialClubs: [
                selectedPersonnel.socialClubs?.[0] || {},
                { ...selectedPersonnel.socialClubs?.[1], name: e.target.value },
              ],
            })
          }
        >
          <option value="">N/A</option>
          <option>Sports Club</option>
          <option>Music Club</option>
          <option>Art Club</option>
        </select>
      </label>

      {/* Social Club 2 Position */}
      <label className="block mb-2">
        <span className="font-bold">Position 2:</span>
        <select
          className="border p-2 w-full"
          value={selectedPersonnel.socialClubs?.[1]?.position || ''}
          onChange={(e) =>
            setSelectedPersonnel({
              ...selectedPersonnel,
              socialClubs: [
                selectedPersonnel.socialClubs?.[0] || {},
                { ...selectedPersonnel.socialClubs?.[1], position: e.target.value },
              ],
            })
          }
        >
          <option value="">N/A</option>
          <option>Moderator</option>
        </select>
      </label>

      {/* Action Buttons */}
      <button
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSaveEdit}
      >
        Save
      </button>
      <button
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
        onClick={() => setIsEditModalOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default PersonnelList;
