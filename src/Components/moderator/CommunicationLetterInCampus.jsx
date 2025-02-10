import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { fetchUser } from "../../states/slices/UserSlicer";
import { getSignature } from "../../services/LetterUtil";

function CommunicationLetterInCampus({
  letter,
  signaturePreview,
  setSignedPeople,
  fetchSignature
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [communicationLetter, setCommunicationLetter] = useState(null);
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
            `/generic-letters/on-click/${letter.id}?type=${letter.type}`
          );
        }
        const response = await axios.get(`/communication-letters/${letter.id}`);
        setCommunicationLetter(response.data?.data);
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
    if (communicationLetter) {
      setSignedPeople(communicationLetter.signed_people);
    }
  }, [communicationLetter]);

  // const fetchSignature = async () => {
  //   try {
  //     const response = await axios.get("/users/get-sm-e-signature");
  //     const signatureData = response.data?.data;
  //     if (signatureData) {
  //       setLocalSignaturePreview(signatureData);
  //     } else {
  //       dispatch(showModal({ message: 'No signature data found' }));
  //     }
  //   } catch (error) {
  //     dispatch(showModal({ message: 'Failed to fetch signature' }));
  //   }
  // };

  return (
    <>
      {communicationLetter && !isLoading && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">DATE:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {communicationLetter.date}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold">{user?.president}</div>
            <div>President</div>
            <div>Notre Dame of Tacurong College</div>
            <div>City of Tacurong</div>
          </div>

          <div>
            <label className="block font-semibold mb-2">LETTER CONTENT:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 min-h-[200px] whitespace-pre-line">
              {communicationLetter.letter_of_content}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {getSignature(communicationLetter, "MODERATOR") ? (
                <img
                  alt="MODERATOR's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={getSignature(communicationLetter, "MODERATOR")}
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
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Signature Preview:</p>
                      <img
                        alt="MODERATOR's Signature"
                        className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                        src={signaturePreview}
                        style={{ maxHeight: "150px", maxWidth: "300px" }}
                      />
                    </div>
                  )}
                </>
              )}

              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center font-semibold"
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

export default CommunicationLetterInCampus;