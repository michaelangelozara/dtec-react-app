import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { getSignature } from "../../services/LetterUtil";

function CommunicationLetterOffCampus({
  letter,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [communicationLetter, setCommunicationLetter] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user) {
    navigate("/user/moderator-transaction");
    return;
  }

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

  console.log(communicationLetter);

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
            <div className="font-bold">REV. FR. DARYLL DHAN L. BILBAO, DCC</div>
            <div>Office Head, CDSO</div>
            <div>Notre Dame of Tacurong College</div>
            <div>City of Tacurong</div>
          </div>

          <div>
            <label className="block font-semibold mb-2">LETTER CONTENT:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 min-h-[200px] whitespace-pre-line">
              {communicationLetter.letter_of_content}
            </div>
          </div>

          {/* Signatures Section */}
          <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
            <p className="font-semibold">Prepared by:</p>
            <img
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: "150px", maxWidth: "300px" }}
              src={communicationLetter.student_officer_signature}
            />
            <p className="mt-2 font-bold">
              {communicationLetter.student_officer}
            </p>
            <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
          </div>

          <div className={`mt-6 ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              <div className="mt-4">
                {getSignature(communicationLetter, "MODERATOR") ? <>

                  <img
                    alt="MODERATOR's Signature"
                    className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                    style={{ maxHeight: "150px", maxWidth: "300px" }}
                    src={getSignature(communicationLetter, "MODERATOR") || ''}
                  />
                </> : <>
                  <>
                    <label className="block font-semibold mb-2">
                      Attach Signature
                    </label>
                    <input
                      type="file"
                      className="border-gray-300 border-2 p-2 rounded-md w-full"
                      accept="image/*"
                      onChange={onSignatureChange}
                      disabled={user.role !== "MODERATOR"}
                    />
                    <img
                      alt="MODERATOR's Signature"
                      className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                      style={{ maxHeight: "150px", maxWidth: "300px" }}
                      src={signaturePreview}
                    />
                  </>
                </>}
              </div>
              {/* {signaturePreview ||
                (signedPerson.status === "EVALUATED" && (
                  <div className="mt-4">
                    <p className="font-semibold">Signature Preview:</p>
                    <img
                      alt="Mayor's Signature"
                      className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                      style={{ maxHeight: "150px", maxWidth: "300px" }}
                    />
                  </div>
                ))} */}
              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center"
                placeholder="Name of Club Moderator"
                disabled
                defaultValue={communicationLetter.moderator}
              />
              <p className="text-sm mt-2">MODERATOR, CLUB, A.Y. 2024-2025</p>
            </div>
          </div>

          <div className={`mt-6 text-center ${user?.role !== "DSA" ? 'hidden' : ''}`}>
            <p className="font-semibold">Noted by:</p>
            {communicationLetter.dsa_signature !== "N/A" && (
              <div className="mt-4">
                <p className="font-semibold">Signature Preview:</p>
                <img
                  alt="Signature Preview"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                />
              </div>
            )}
            <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
            <p>DIRECTOR OF STUDENT AFFAIRS</p>
          </div>

          <div className={`mt-6 text-center ${user?.role !== "OFFICE_HEAD" ? 'hidden' : ''}`}>
            <p className="font-semibold">Approved by:</p>
            {communicationLetter.office_head_signature !== "N/A" && (
              <div className="mt-4">
                <p className="font-semibold">Signature Preview:</p>
                <img
                  alt="Signature Preview"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                />
              </div>
            )}
            <p className="mt-2 font-bold">
              REV. FR. DARYLL DHAN L. BILBAO, DCC
            </p>
            <p>Office Head, CDSO</p>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunicationLetterOffCampus;
