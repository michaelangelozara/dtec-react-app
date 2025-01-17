import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";
import { getSignature } from '../../services/LetterUtil';
import Fingerprint from '../Fingerprint/Fingerprint';

function UseFacilitiesFormView({
  facilities,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [facilitiesForm, setFacilitiesForm] = useState(null);
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
            `/generic-letters/on-click/${facilities.id}?type=${facilities.type}`
          );
        }
        const response = await axios.get(`/sfefs/${facilities.id}`);
        setFacilitiesForm(response.data?.data);
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
    if (facilitiesForm) {
      setSignedPeople(facilitiesForm?.signed_people)
    }
  }, [facilitiesForm]);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        USE OF SCHOOL FACILITIES & EQUIPMENT FORM
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">Requisitioner:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.requisitioner}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Club:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Position:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.position}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Name of Venue/s:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {facilitiesForm?.venue}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Activity/Purpose:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {facilitiesForm?.activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Date and Time:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.date} | {facilitiesForm?.time_from} - {facilitiesForm?.time_to}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Facilities/Equipment Needed:</label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name of Facilities/Equipment</th>
                <th className="border border-gray-300 p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {facilitiesForm?.facilityOrEquipments?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requested By (Student Officer) */}
      <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
        <p className="font-semibold">Requested By:</p>
        {facilitiesForm && getSignature(facilitiesForm, "STUDENT_OFFICER") ? (
          <img
            src={getSignature(facilitiesForm, "STUDENT_OFFICER")}
            alt="Student Officer's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="Student Officer's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{facilitiesForm?.requisitioner}</p>
        <p className="text-sm mt-2">Mayor, {facilitiesForm?.club}</p>
      </div>

      {/* Noted By (Moderator) */}
      <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted By:</p>
        <div className={`mt-4 ${user?.role !== "MODERATOR" ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "MODERATOR"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {facilitiesForm && getSignature(facilitiesForm, "MODERATOR") ? (
          <img
            src={getSignature(facilitiesForm, "MODERATOR")}
            alt="Moderator's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="Moderator's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{user?.moderator}</p>
        <p className="text-sm mt-2">Moderator, {facilitiesForm?.club}</p>
      </div>

      {/* Booked By (Office Head) */}
      <div className={`mt-6 text-center ${user?.role !== "AUXILIARY_SERVICE_HEAD" ? 'hidden' : ''}`}>
        <p className="font-semibold">Booked By:</p>
        <div className={`mt-4 ${user?.role !== "AUXILIARY_SERVICE_HEAD" ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "AUXILIARY_SERVICE_HEAD"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {facilitiesForm && getSignature(facilitiesForm, "AUXILIARY_SERVICE_HEAD") ? (
          <img
            src={getSignature(facilitiesForm, "AUXILIARY_SERVICE_HEAD")}
            alt="AUXILIARY_SERVICE_HEAD's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="AUXILIARY_SERVICE_HEAD's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{user?.office_head}</p>
        <p>Auxiliary Service Head</p>
      </div>

      {/* Acknowledged By Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Acknowledged By:</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Chapel In-charge */}
          <div className={user?.role !== "CHAPEL" ? 'hidden' : ''}>
            <div className={`mt-4 ${user?.role !== "CHAPEL" ? "hidden" : ""}`}>
              <button
                onClick={() => setCaptureFingerprint(true)}
                disabled={user?.role !== "CHAPEL"}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>
            {facilitiesForm && getSignature(facilitiesForm, "CHAPEL") ? (
              <img
                src={getSignature(facilitiesForm, "CHAPEL")}
                alt="CHAPEL's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            ) : (
              signature && (
                <img
                  src={signature}
                  alt="CHAPEL's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: '150px', maxWidth: '300px' }}
                />
              )
            )}
            <p className="mt-2 font-bold">{user?.chapel_incharge || "Chapel In-charge"}</p>
            <p className="text-sm">Chapel In-charge</p>
          </div>

          {/* Physical Plant In-charge */}
          <div className={user?.role !== "PPLO" ? 'hidden' : ''}>
            <div className={`mt-4 ${user?.role !== "PPLO" ? "hidden" : ""}`}>
              <button
                onClick={() => setCaptureFingerprint(true)}
                disabled={user?.role !== "PPLO"}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>
            {facilitiesForm && getSignature(facilitiesForm, "PPLO") ? (
              <img
                src={getSignature(facilitiesForm, "PPLO")}
                alt="PPLO's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            ) : (
              signature && (
                <img
                  src={signature}
                  alt="PPLO's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: '150px', maxWidth: '300px' }}
                />
              )
            )}
            <p className="mt-2 font-bold">{user?.physical_plant_incharge || "Physical Plant In-charge"}</p>
            <p className="text-sm">Physical Plant In-charge</p>
          </div>

          {/* Multimedia In-charge */}
          <div className={user?.role !== "MULTIMEDIA" ? 'hidden' : ''}>
            <div className={`mt-4 ${user?.role !== "MULTIMEDIA" ? "hidden" : ""}`}>
              <button
                onClick={() => setCaptureFingerprint(true)}
                disabled={user?.role !== "MULTIMEDIA"}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>
            {facilitiesForm && getSignature(facilitiesForm, "MULTIMEDIA") ? (
              <img
                src={getSignature(facilitiesForm, "MULTIMEDIA")}
                alt="MULTIMEDIA's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            ) : (
              signature && (
                <img
                  src={signature}
                  alt="MULTIMEDIA's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: '150px', maxWidth: '300px' }}
                />
              )
            )}
            <p className="mt-2 font-bold">{user?.multimedia_incharge || "Multimedia In-charge"}</p>
            <p className="text-sm">Multimedia In-charge</p>
          </div>
        </div>
      </div>

      {/* Approved By (President) */}
      <div className={`mt-6 text-center ${user?.role !== "PRESIDENT" ? 'hidden' : ''}`}>
        <p className="font-semibold">Approved By:</p>
        <div className={`mt-4 ${user?.role !== "PRESIDENT" || getSignature(facilitiesForm, "PRESIDENT") || signature ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "PRESIDENT"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {facilitiesForm && getSignature(facilitiesForm, "PRESIDENT") ? (
          <img
            src={getSignature(facilitiesForm, "PRESIDENT")}
            alt="President's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="President's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{user?.president}</p>
        <p>NDTC President</p>
      </div>

      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview}
        />
      )}
    </div>
  );
}

export default UseFacilitiesFormView;