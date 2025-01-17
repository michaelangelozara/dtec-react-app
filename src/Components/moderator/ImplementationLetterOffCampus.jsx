import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";
import { FaFingerprint } from "react-icons/fa";
import TorreseSig from "../../assets/images/torresesig.png";

function ImplementationLetterOffCampus({
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

        const response = await axios.get(
          `/implementation-letter-off-campuses/${letter.id}`
        );
        setImplementationLetter(response.data?.data);
      } catch (error) {
        console.log(error);
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
          <h2 className="text-center text-2xl font-bold mb-8 underline">
            INSTITUTIONAL OUTREACH PROJECT PROPOSAL
          </h2>

          <div>
            <label className="block font-semibold mb-2">
              I. TITLE OF THE ACTIVITY
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.name_of_activity}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY
              / SERVICE
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {implementationLetter.description}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              III. TARGET GROUP AND REASONS FOR CHOOSING IT
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {implementationLetter.reason}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              IV. DATE AND TIME OF IMPLEMENTATION
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {implementationLetter.date_time}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              V. COMMITTEE, ACTIVITIES, OBJECTIVES, OUTPUTS
            </label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">ACTIVITIES</th>
                    <th className="border border-gray-300 p-2">OBJECTIVES</th>
                    <th className="border border-gray-300 p-2">
                      EXPECTED OUTPUT
                    </th>
                    <th className="border border-gray-300 p-2">
                      COMMITTEES/IN-CHARGE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {implementationLetter?.caoos?.map((activity, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {activity.activity}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {activity.objective}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {activity.expectedOutput}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {activity.committee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              VI. PROGRAM OR FLOW OF ACTIVITIES
            </label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
              {implementationLetter.program_or_flow}
            </div>
          </div>

          {/* Signatures Section */}
          <div className="mt-6 text-center">
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
            <p className="text-sm mt-2">Mayor, {user?.officer_at} A.Y. 2023-2024</p>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {implementationLetter.office_head_signature !== "N/A" ? (
                <img
                  alt="Community Development Officer's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={implementationLetter.office_head_signature}
                />
              ) : (
                <>
                  <button
                    onClick={() =>
                      onSignatureChange({ target: { files: [TorreseSig] } })
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                    disabled={user.role !== "COMMUNITY"}
                  >
                    <FaFingerprint /> Attach Signature
                  </button>
                  {signaturePreview && (
                    <div className="mt-4">
                      <p className="font-semibold">Signature Preview:</p>
                      <img
                        src={signaturePreview}
                        alt="Signature Preview"
                        className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                        style={{ maxHeight: "150px", maxWidth: "300px" }}
                      />
                    </div>
                  )}
                </>
              )}
              <p className="mt-2 font-bold">
                REV. FR. DARYLL DHAN L. BILBAO, DCC
              </p>
              <p>Community Development and Services Officer</p>
            </div>
          </div>

          <div className="mt-6 text-center">
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
                disabled={user.role !== "PRESIDENT"}
              />
            </div>
            {signaturePreview ||
              (implementationLetter.president_signature !== "N/A" && (
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
            <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
            <p>NDTC President</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ImplementationLetterOffCampus;
