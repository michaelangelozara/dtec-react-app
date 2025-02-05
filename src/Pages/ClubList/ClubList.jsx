import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "../../api/AxiosConfig";
import Modal from "../../Components/modal/Modal";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { showModal } from "../../states/slices/ModalSlicer";

function ClubList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [newLogo, setNewLogo] = useState("");
  const [mount, setMount] = useState(false);

  const dispatch = useDispatch();

  const handleEdit = (club) => {
    setSelectedClub(club);
    setIsEditModalOpen(true);
  };

  const handleLogoUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setNewLogo(reader.result); // Store Base64 string in state
      };
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || club?.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUpdateLogo = async () => {
    if (newLogo === "" || newLogo === null) {
      dispatch(showModal({message : "Please Attach Logo!"}))
      return;
    }

    try {
      const response = await axios.put(`/admin/clubs/${selectedClub?.id}/update-logo`, {
        image: newLogo
      });

      if (response.status === 200) {
        setTimeout(() => {
          setIsEditModalOpen(false);
        }, 2000);
        dispatch(showModal({ message: response?.data?.message }));
        setMount(v => !v);
      }
    } catch (error) {
      if (error.status === 403) {
        dispatch(showModal({ message: error?.response?.data?.message }));
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/clubs");
        setClubs(response?.data?.data);
      } catch (error) {

      }
    }

    fetchData();
  }, [mount]);

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
            <option value="DEPARTMENT">Departmental Club</option>
            <option value="SOCIAL">Social Club</option>
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
                      alt={`${club.name} Logo`}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {club.short_name}
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
            <h3 className="text-lg font-semibold mb-4">Update Logo for {selectedClub.name}</h3>
            <div className="mb-4">
              <img
                src={newLogo || selectedClub?.logo}
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
                  setNewLogo("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdateLogo}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal />
    </div>

  );
}

export default ClubList;