import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClub, setNewClub] = useState({
    logo: null,
    clubName: "",
    shortform: "",
  });

  const handleCreateClub = () => {
    if (!newClub.logo || !newClub.clubName || !newClub.shortform) {
      alert("Please fill in all fields and upload a logo.");
      return;
    }
    setClubs([
      ...clubs,
      { ...newClub, id: clubs.length + 1 },
    ]);
    setNewClub({ logo: null, clubName: "", shortform: "" });
    setIsCreateModalOpen(false);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this club?"
    );
    if (confirmed) {
      setClubs(clubs.filter((club) => club.id !== id));
    }
  };

  // Filter clubs based on search query
  const filteredClubs = clubs.filter((club) =>
    club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Heading and Create Button */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800">List of Clubs</h2>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus className="mr-2" /> Create Club
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Logo
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Club Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Shortform
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map((club) => (
                <tr key={club.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    <img
                      src={club.logo}
                      alt={`${club.clubName} Logo`}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.clubName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.shortform}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleDelete(club.id)}
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClubs.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center border border-gray-300 px-4 py-2 text-sm text-gray-500"
                  >
                    No clubs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Club Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create New Club</h3>
            <label className="block mb-2">
              <span className="font-bold">Club Name:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={newClub.clubName}
                onChange={(e) =>
                  setNewClub({ ...newClub, clubName: e.target.value })
                }
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Shortform:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={newClub.shortform}
                onChange={(e) =>
                  setNewClub({ ...newClub, shortform: e.target.value })
                }
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Logo:</span>
              <input
                type="file"
                className="border p-2 w-full"
                onChange={(e) =>
                  setNewClub({ ...newClub, logo: URL.createObjectURL(e.target.files[0]) })
                }
              />
            </label>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleCreateClub}
            >
              Create
            </button>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubList;
