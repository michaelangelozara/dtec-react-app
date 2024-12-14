import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";

// Club data
const departmentalClubs = [
  "PSITS",
  "FINANCE",
  "JSWAP",
  "ICPEP.SE",
  "PNSA",
  "JHARA",
  "JPMA",
  "JPIA",
  "UPSCISTS",
  "JMC",
  "PMC"
].map(name => ({
  id: `dep-${name}`,
  clubName: name,
  clubType: "Departmental Club",
  shortform: name,
  logo: "https://via.placeholder.com/50" // Placeholder logo
}));

const socialClubs = [
  "JEM",
  "CES",
  "ASPA",
  "PCC",
  "MSO",
  "YSLC",
  "BLC",
  "KKB",
  "KARATE-DO",
  "TEATRO BALINTATAW"
].map(name => ({
  id: `soc-${name}`,
  clubName: name,
  clubType: "Social Club",
  shortform: name,
  logo: "https://via.placeholder.com/50" // Placeholder logo
}));

function ClubList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [clubs, setClubs] = useState([...departmentalClubs, ...socialClubs]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleEdit = (club) => {
    setSelectedClub(club);
    setIsEditModalOpen(true);
  };

  const handleLogoUpdate = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newLogo = URL.createObjectURL(e.target.files[0]);
      setClubs(clubs.map(club => 
        club.id === selectedClub.id 
          ? { ...club, logo: newLogo }
          : club
      ));
      setIsEditModalOpen(false);
      setSelectedClub(null);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.clubName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || club.clubType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      
      <PrimaryNavBar />

      {/* Heading and Search */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800">List of Clubs</h2>
        <div className="flex space-x-4 items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Types</option>
            <option value="Departmental Club">Departmental Club</option>
            <option value="Social Club">Social Club</option>
          </select>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
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
                  Club Type
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
                    {club.clubType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.clubName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.shortform}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleEdit(club)}
                    >
                      <FaEdit className="inline mr-1" /> Edit Logo
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClubs.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
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

      {/* Edit Logo Modal */}
      {isEditModalOpen && selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Update Logo for {selectedClub.clubName}</h3>
            <div className="mb-4">
              <img
                src={selectedClub.logo}
                alt="Current Logo"
                className="w-24 h-24 object-cover rounded-lg mx-auto"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpdate}
              className="w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedClub(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubList;