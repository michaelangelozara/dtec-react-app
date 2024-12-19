import React, { useEffect, useState } from "react";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import signature from "./try.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";

function CommunicationLetterOffCampus({
  letter,
  signaturePreview,
  onSignatureChange,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [communicationLetter, setCommunicatioLetter] = useState(null);

  const handleCaptureFingerprint = () => {
    
  };

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
        setCommunicatioLetter(response.data?.data);
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

  const dsa = communicationLetter?.signed_people?.filter((sp) => sp.role === "DSA")[0];
  const officeHead = communicationLetter?.signed_people?.filter((sp) => sp.role === "OFFICE_HEAD")[0];

  return (
    <>
      {!isLoading  && communicationLetter && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">DATE:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {letter.content?.date}
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
              {letter.content?.letterContent}
            </div>
          </div>

          {/* Mayor's Signature (Always shown) */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Prepared by:</p>
            <img
              src={signature}
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: "150px", maxWidth: "300px" }}
            />
            <p className="mt-2 font-bold">CHRISTIAN JAMES V. TORRES</p>
            <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
          </div>

          {/* Moderator's Signature (Always shown) */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Noted by:</p>
            <img
              src={signature}
              alt="Moderator's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: "150px", maxWidth: "300px" }}
            />
            <p className="mt-2 font-bold">[Moderator Name]</p>
            <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
          </div>

          {/* DSA Signature Section */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Noted by:</p>
            {dsa && dsa.signature ? (
              <img
                src={dsa.signature}
                alt="DSA Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: "150px", maxWidth: "300px" }}
              />
            ) : (
              <div className={`mt-4 ${user?.role !== "DSA" ? "hidden" : ""}`}>
                <button
                  disabled={user?.role !== "DSA"}
                  onClick={() => handleCaptureFingerprint()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <FingerPrintIcon className="w-6 h-6" />
                  <span>Capture Fingerprint</span>
                </button>
              </div>
            )}
            <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
            <p>Director of Student Affairs</p>
          </div>

          {/* CDSO Head Signature Section */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Approved by:</p>
            {officeHead && officeHead.signature ? (
              <img
                src={officeHead.signature}
                alt="CDSO Head Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: "150px", maxWidth: "300px" }}
              />
            ) : (
              <div className={`mt-4 ${user?.role !== "OFFICE_HEAD" ? "hidden" : ""}`}>
                <button
                  onClick={() => handleCaptureFingerprint()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <FingerPrintIcon className="w-6 h-6" />
                  <span>Capture Fingerprint</span>
                </button>
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
