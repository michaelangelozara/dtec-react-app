import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { fetchUser } from "../../states/slices/UserSlicer";
import { getSignature } from "../../services/LetterUtil";

function PermitToEnterModal({
  permit,
  onSignatureChange,
  setSignedPeople,
  fetchSignature,
  signaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [permitDetails, setPermitDetails] = useState(null);
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
            `/generic-letters/on-click/${permit.id}?type=${permit.type}`
          );
        }
        const response = await axios.get(`/permit-to-enters/${permit.id}`);
        setPermitDetails(response.data?.data);
      } catch (error) {
        if (error.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (permitDetails) {
      setSignedPeople(Array.isArray(permitDetails.signed_people) ? permitDetails.signed_people : []);
    }
  }, [permitDetails]);

  return (
    <>
      {permitDetails && !isLoading && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Requisitioner:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {permitDetails?.requisitioner}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Club:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {user?.officer_at}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Activity/Purpose:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {permitDetails.activity}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Date:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {permitDetails.date}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Time From:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {permitDetails.time_from}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Time To:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {permitDetails.time_to}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Participants:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {permitDetails.participants}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {getSignature(permitDetails, "MODERATOR") ? (
                <img
                  alt="MODERATOR's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={getSignature(permitDetails, "MODERATOR")}
                />
              ) : (
                <>
                  <button
                    onClick={fetchSignature}
                    className={`${signaturePreview ? 'hidden' : ''} bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto`}
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

export default PermitToEnterModal;