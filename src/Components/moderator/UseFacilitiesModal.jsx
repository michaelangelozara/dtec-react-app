import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { fetchUser } from "../../states/slices/UserSlicer";
import { getSignature } from "../../services/LetterUtil";

function UseFacilitiesModal({
  facilities,
  onSignatureChange,
  setSignedPeople,
  fetchSignature,
  signaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [facilitiesDetails, setFacilitiesDetails] = useState(null);
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user) {
    navigate("/user/moderator-transaction");
    return;
  }

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, status, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user.role !== "STUDENT_OFFICER") {
          await axios.post(
            `/generic-letters/on-click/${facilities.id}?type=${facilities.type}`
          );
        }
        const response = await axios.get(`/sfefs/${facilities.id}`);
        setFacilitiesDetails(response.data?.data);
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facilities, user.role, dispatch]);


  useEffect(() => {
    if (facilitiesDetails) {
      setSignedPeople(
        Array.isArray(facilitiesDetails.signed_people)
          ? facilitiesDetails.signed_people
          : []
      );
    }
  }, [facilitiesDetails, setSignedPeople]);

  console.log(facilitiesDetails);
  return (
    <>
      {facilitiesDetails && !isLoading && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Requisitioner:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {user?.officer || "N/A"}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Club:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {facilitiesDetails.club || "N/A"}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Venue/s:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {facilitiesDetails.venue || "N/A"}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Activity/Purpose:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {facilitiesDetails.activity || "N/A"}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Date:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {facilitiesDetails.date || "N/A"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Time From:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {facilitiesDetails.time_from || "N/A"}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Time To:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {facilitiesDetails.time_to || "N/A"}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Facilities/Equipment:</label>
            <div className="border-2 border-gray-300 rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name of Facilities/Equipment</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(facilitiesDetails.facilityOrEquipments) &&
                  facilitiesDetails.facilityOrEquipments.length > 0 ? (
                    facilitiesDetails.facilityOrEquipments.map((item, index) => (
                      <tr key={index} className="border-t border-gray-300">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No facilities or equipment listed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {getSignature(facilitiesDetails, "MODERATOR") ? (
                <img
                  alt="MODERATOR's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={getSignature(facilitiesDetails, "MODERATOR")}
                />
              ) : (
                <>
                  <button
                    onClick={fetchSignature}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                    disabled={user.role !== "MODERATOR"}
                  >
                    <FaFingerprint /> Attach Signature
                  </button>
                  {signaturePreview && (
                    <div className="mt-4">
                      <p className="font-semibold">Signature Preview:</p>
                      <img
                        alt="MODERATOR's Signature"
                        className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                        style={{ maxHeight: "150px", maxWidth: "300px" }}
                        src={signaturePreview}
                      />
                    </div>
                  )}
                </>
              )}

              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center"
                placeholder="Name of Club Moderator"
                disabled
                defaultValue={
                  user?.middle_name
                    ? user?.first_name +
                      " " +
                      user?.middle_name[0] +
                      ". " +
                      user?.lastname
                    : user?.first_name + " " + user?.lastname
                }
              />
              <p className="text-sm mt-2">
                MODERATOR, {user?.officer_at}, A.Y. 2024-2025
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UseFacilitiesModal;
