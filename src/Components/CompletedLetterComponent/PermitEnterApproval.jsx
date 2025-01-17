import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";
import { getSignature } from '../../services/LetterUtil';
import { showModal } from '../../states/slices/ModalSlicer';

function PermitEnterApproval({
  permit,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permitDetails, setPermitDetails] = useState(null);

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
      setSignedPeople(permitDetails?.signed_people)
    }
  }, [permitDetails]);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        PERMIT TO ENTER THE CAMPUS OUTSIDE REGULAR SCHEDULES
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">Requisitioner:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.requisitioner}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Club:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Position:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.position}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Activity/Purpose:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {permitDetails?.activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Date and Time:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.date} | {permitDetails?.time_from} - {permitDetails?.time_to}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Participants:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {permitDetails?.participants}
        </div>
      </div>

      {/* Requested By (Student Officer) */}
      <div className={`mt-6 text-center`}>
        <p className="font-semibold">Requested By:</p>
        {permitDetails && getSignature(permitDetails, "STUDENT_OFFICER") && (
          <img
            src={getSignature(permitDetails, "STUDENT_OFFICER")}
            alt="Student Officer's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">{permitDetails?.requisitioner}</p>
        <p className="text-sm mt-2">Mayor, {permitDetails?.club}</p>
      </div>

      {/* Noted By (Moderator) */}
      <div className={`mt-6 text-center`}>
        <p className="font-semibold">Noted By:</p>
        {permitDetails && getSignature(permitDetails, "MODERATOR") && (
          <img
            src={getSignature(permitDetails, "MODERATOR")}
            alt="Student Officer's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">{user?.moderator}</p>
        <p className="text-sm mt-2">Moderator, {permitDetails?.club}</p>
      </div>

      {/* Booked By (Office Head) */}
      <div className={`mt-6 text-center`}>
        <p className="font-semibold">Booked By:</p>
        {permitDetails && getSignature(permitDetails, "OFFICE_HEAD") && (
          <img
            src={getSignature(permitDetails, "OFFICE_HEAD")}
            alt="Student Officer's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">{user?.office_head}</p>
        <p>Office Head, CDSO</p>
      </div>

      {/* Approved By (President) */}
      <div className={`mt-6 text-center`}>
        <p className="font-semibold">Approved By:</p>
        {permitDetails && getSignature(permitDetails, "PRESIDENT") && (
          <img
            src={getSignature(permitDetails, "PRESIDENT")}
            alt="Student Officer's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">{user?.president}</p>
        <p>NDTC President</p>
      </div>
    </div>
  );
}

export default PermitEnterApproval;