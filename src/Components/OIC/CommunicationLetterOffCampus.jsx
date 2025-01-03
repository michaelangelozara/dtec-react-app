import React, { useEffect, useState } from "react";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import signature from "./try.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";
import Fingerprint from "../Fingerprint/Fingerprint";
import { getSignature } from "../../services/LetterUtil";

function CommunicationLetterOffCampus({
  letter,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [communicationLetter, setCommunicatioLetter] = useState(null);
  const [captureFingerprint, setCaptureFingerprint] = useState(false);
  const [signature, setSignature] = useState(null);


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

  useEffect(() => {
    if (communicationLetter) {
      setSignedPeople(communicationLetter?.signed_people)
    }
  }, [communicationLetter]);

  // const dsa = communicationLetter?.signed_people?.filter((sp) => sp.role === "DSA")[0];
  // const officeHead = communicationLetter?.signed_people?.filter((sp) => sp.role === "OFFICE_HEAD")[0];

  return (
    <>
      {!isLoading && communicationLetter && (
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
          <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
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
          <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
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
          <div className={`mt-6 text-center ${user?.role !== "DSA" ? 'hidden' : ''}`}>
            <p className="font-semibold">Noted by:</p>
            <div className={`mt-4 ${user?.role !== "DSA" ? "hidden" : ""}`}>
              <button
                onClick={() => setCaptureFingerprint(true)}
                disabled={user?.role !== "DSA"}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>

            {communicationLetter && getSignature(communicationLetter, "DSA") ? <>
              <img
                src={getSignature(communicationLetter, "DSA")}
                alt="DSA's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            </> : <>
              {signature && (
                <img
                  src={signature}
                  alt="DSA's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: '150px', maxWidth: '300px' }}
                />
              )}
            </>}
            <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
            <p>Director of Student Affairs</p>
          </div>

          {/* CDSO Head Signature Section */}
          <div className={`mt-6 text-center ${user?.role !== "OFFICE_HEAD" ? 'hidden' : ''}`}>
            <p className="font-semibold">Approved by:</p>
            <div className={`mt-4 ${user?.role !== "OFFICE_HEAD" ? "hidden" : ""}`}>
              <button
                onClick={() => setCaptureFingerprint(true)}
                disabled={user?.role !== "OFFICE_HEAD"}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>
            {communicationLetter && getSignature(communicationLetter, "OFFICE_HEAD") ? <>
              <img
                src={getSignature(communicationLetter, "OFFICE_HEAD")}
                alt="DSA's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            </> : <>
              {signature && (
                <img
                  src={signature}
                  alt="OFFICE_HEAD's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: '150px', maxWidth: '300px' }}
                />
              )}
            </>}
            <p className="mt-2 font-bold">
              REV. FR. DARYLL DHAN L. BILBAO, DCC
            </p>
            <p>Office Head, CDSO</p>
          </div>
        </div>
      )}
      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview} />
      )}
    </>
  );
}

export default CommunicationLetterOffCampus;
