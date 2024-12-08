import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideModal } from '../../states/slices/ModalSlicer';

const Modal = () => {
    const { isOpen, message } = useSelector((state) => state.modal);

    const dispatch = useDispatch();
    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(hideModal());  // Dispatching hideModal when button is clicked
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
                <p className="text-lg font-semibold text-gray-700 text-center">{message}</p>
                <button
                    type='button'
                    className="mt-4 px-4 py-2 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none"
                    onClick={handleClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default Modal;