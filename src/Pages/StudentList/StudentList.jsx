import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { fetchUser } from "../../states/slices/UserSlicer";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../Components/modal/Modal";

function StudentList() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmed) {
      setUsers(users.filter((student) => student.id !== id));
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setUsers(
      users.map((s) => (s.id === selectedStudent.id ? selectedStudent : s))
    );
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }

    if (user && !adminRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user]);

  return (
    <>
      {status === "Succeeded" && (
        <div className="min-h-screen bg-gray-100">
          <PrimaryNavBar />

          {/* Heading */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              List of Students
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
                      Course & Year
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
                      Social Club 1
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Position 1
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Social Club 2
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Position 2
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.idNumber}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.courseYear}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.role}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.departmentalClub.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.departmentalClub.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.socialClubs[0]?.name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.socialClubs[0]?.position || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.socialClubs[1]?.name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {student.socialClubs[1]?.position || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg mx-1"
                          onClick={() => handleView(student)}
                        >
                          <FaEye className="inline" /> View
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg mx-1"
                          onClick={() => handleEdit(student)}
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mx-1"
                          onClick={() => handleDelete(student.id)}
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
                <h3 className="text-xl font-semibold mb-4">View Student</h3>
                <p>
                  <span className="font-bold">ID Number:</span>{" "}
                  {selectedStudent.idNumber}
                </p>
                <p>
                  <span className="font-bold">Name:</span> {selectedStudent.name}
                </p>
                <p>
                  <span className="font-bold">Course & Year:</span>{" "}
                  {selectedStudent.courseYear}
                </p>
                <p>
                  <span className="font-bold">Role:</span> {selectedStudent.role}
                </p>
                <p>
                  <span className="font-bold">Departmental Club:</span>{" "}
                  {selectedStudent.departmentalClub.name} (
                  {selectedStudent.departmentalClub.position})
                </p>
                {selectedStudent.socialClubs.length > 0 ? (
                  selectedStudent.socialClubs.map((club, index) => (
                    <p key={index}>
                      <span className="font-bold">Social Club {index + 1}:</span>{" "}
                      {club.name || "N/A"} ({club.position || "N/A"})
                    </p>
                  ))
                ) : (
                  <p>
                    <span className="font-bold">Social Clubs:</span> No social clubs
                    assigned.
                  </p>
                )}
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
                <h3 className="text-xl font-semibold mb-4">Edit Student</h3>
                <label className="block mb-2">
                  <span className="font-bold">Name:</span>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={selectedStudent.name}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, name: e.target.value })
                    }
                  />
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Course & Year:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.courseYear}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, courseYear: e.target.value })
                    }
                  >
                    <option>BSCS 4th Year</option>
                    <option>BSCS 3rd Year</option>
                    <option>BSCS 2nd Year</option>
                    <option>BSCS 1st Year</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Role:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.role}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, role: e.target.value })
                    }
                  >
                    <option>Student</option>
                    <option>Officer</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Departmental Club:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.departmentalClub.name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        departmentalClub: {
                          ...selectedStudent.departmentalClub,
                          name: e.target.value,
                        },
                      })
                    }
                  >
                    <option>Coding Club</option>
                    <option>Robotics Club</option>
                    <option>Web Developers Club</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Departmental Position:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.departmentalClub.position}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        departmentalClub: {
                          ...selectedStudent.departmentalClub,
                          position: e.target.value,
                        },
                      })
                    }
                  >
                    <option>Member</option>
                    <option>President</option>
                    <option>Treasurer</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Social Club 1:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.socialClubs[0]?.name || ''}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        socialClubs: [
                          { ...selectedStudent.socialClubs[0], name: e.target.value },
                          selectedStudent.socialClubs[1] || {},
                        ],
                      })
                    }
                  >
                    <option value="">N/A</option>
                    <option>Photography Club</option>
                    <option>Gaming Club</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Position 1:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.socialClubs[0]?.position || ''}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        socialClubs: [
                          { ...selectedStudent.socialClubs[0], position: e.target.value },
                          selectedStudent.socialClubs[1] || {},
                        ],
                      })
                    }
                  >
                    <option value="">N/A</option>
                    <option>Member</option>
                    <option>Player</option>
                    <option>Moderator</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Social Club 2:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.socialClubs[1]?.name || ''}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        socialClubs: [
                          selectedStudent.socialClubs[0] || {},
                          { ...selectedStudent.socialClubs[1], name: e.target.value },
                        ],
                      })
                    }
                  >
                    <option value="">N/A</option>
                    <option>Photography Club</option>
                    <option>Gaming Club</option>
                  </select>
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Position 2:</span>
                  <select
                    className="border p-2 w-full"
                    value={selectedStudent.socialClubs[1]?.position || ''}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        socialClubs: [
                          selectedStudent.socialClubs[0] || {},
                          { ...selectedStudent.socialClubs[1], position: e.target.value },
                        ],
                      })
                    }
                  >
                    <option value="">N/A</option>
                    <option>Member</option>
                    <option>Player</option>
                    <option>Moderator</option>
                  </select>
                </label>
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
          <Modal />
        </div>
      )}
    </>
  );
}

export default StudentList;
