import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";
import { getSignature } from "../../services/LetterUtil";
import { FaFingerprint } from "react-icons/fa";
import TorreseSig from "../../assets/images/torresesig.png";

function ImplementationLetter({
  letter,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [implementationLetter, setImplementationLetter] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user) {
    navigate("/user-login");
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

        const response = await axios.get(
          `/implementation-letter-in-campuses/${letter.id}`
        );
        setImplementationLetter(response.data?.data);
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
    if (implementationLetter) {
      setSignedPeople(implementationLetter.signed_people);
    }
  }, [implementationLetter]);

  return (
    <>
      {implementationLetter && !isLoading && (
        <div className="space-y-4">
          {/* Basic Information */}
          <div>
            <label className="block font-semibold mb-2">
              ORGANIZATION/CLUB NAME:
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.club}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              NAME OF ACTIVITY:
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.name_of_activity}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              SEMESTER & SCHOOL YEAR:
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.semester_and_school_year}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">TITLE:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.title}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">DATE AND TIME:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.date_time}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">VENUE:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.venue}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">PARTICIPANTS:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.participants}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">RATIONALE :</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
              {implementationLetter.rationale}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">OBJECTIVES :</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
              {implementationLetter.objective}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">
              SOURCES OF FUND :
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
              {implementationLetter.source_of_fund}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">
              PROJECTED EXPENSES :
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
              {implementationLetter.projected_expenses}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">
              EXPECTED OUTPUT :
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
              {implementationLetter.expected_output}
            </div>
          </div>

          {/* Signatures Section */}
          <div
            className={`mt-6 text-center ${
              user?.role !== "STUDENT_OFFICER" ? "hidden" : ""
            }`}
          >
            <p className="font-semibold">Prepared by:</p>
            <img
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: "150px", maxWidth: "300px" }}
              src={implementationLetter.student_officer_signature}
            />
            <p className="mt-2 font-bold">
              {implementationLetter.student_officer}
            </p>
            <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
          </div>

          <div className={`mt-6 ${user?.role !== "MODERATOR" ? "hidden" : ""}`}>
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {getSignature(implementationLetter, "MODERATOR") ? (
                <img
                  alt="MODERATOR's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={getSignature(implementationLetter, "MODERATOR") || ""}
                />
              ) : (
                <>
                  <button
                    onClick={() =>
                      onSignatureChange({ target: { files: [TorreseSig] } })
                    }
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
                defaultValue={implementationLetter.moderator}
                disabled
              />
              <p className="text-sm mt-2">
                MODERATOR, {user?.officer_at}, A.Y. 2024-2025
              </p>
            </div>
          </div>

          <div
            className={`mt-6 text-center ${
              user?.role !== "DSA" ? "hidden" : ""
            }`}
          >
            <p className="font-semibold">Approved by:</p>
            <div className="mt-4">
              <label className="block font-semibold mb-2">
                Attach Signature
              </label>
              <input
                type="file"
                className="border-gray-300 border-2 p-2 rounded-md w-full"
                accept="image/*"
                onChange={onSignatureChange}
                disabled={user.role !== "DSA"}
              />
            </div>
            {signaturePreview ||
              (implementationLetter.dsa_signature !== "N/A" && (
                <div className="mt-4">
                  <p className="font-semibold">Signature Preview:</p>
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                    style={{ maxHeight: "150px", maxWidth: "300px" }}
                  />
                </div>
              ))}
            <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
            <p>Director of Student Affairs</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ImplementationLetter;
