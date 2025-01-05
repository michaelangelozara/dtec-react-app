import { useEffect, useRef, useState } from "react";
import * as Stomp from '@stomp/stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
import configAxios from "../../api/AxiosConfig";
import { useDispatch } from "react-redux";
import { showModal } from "../../states/slices/ModalSlicer";

function Fingerprint({ onOkClick , setSignature, setSignaturePreview}) {
    const dispatch = useDispatch();

    const [isConnected, setIsConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validatedFingerprint, setValidatedFingerprint] = useState(null);
    const [eSignature, setESignature] = useState(null);
    const [myData, setMyData] = useState({
        ip: null,
        fingerprints: null
    });
    const myDataRef = useRef(myData); // Create a ref to store the latest myData

    useEffect(() => {
        myDataRef.current = myData; // Update the ref value whenever myData changes
    }, [myData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response1 = await axios.get("https://api.ipify.org?format=json");
                const response2 = await configAxios.get("/users/fingerprints");
                setMyData(prevState => ({
                    ...prevState,
                    ip: response1?.data?.ip,
                    fingerprints: response2?.data?.data
                }));
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.ipify.org?format=json");
                setMyIp(response?.data);
            } catch (err) {
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Create SockJS instance and Stomp client
        const socketFactory = () => new SockJS('http://localhost:8080/ws');
        const client = Stomp.Stomp.over(socketFactory);

        // Connect to the WebSocket server
        client.connect(
            {},
            (frame) => {
                setIsConnected(true);
                setStompClient(client);

                // Subscribe to the topic
                client.subscribe('/topic/receive-success-fingerprints', (message) => {
                    const validFingerprint = JSON.parse(message.body);
                    setValidatedFingerprint(validFingerprint?.body?.data);
                });
            },
            (error) => {
                console.error('Error connecting to WebSocket:', error);
                setIsConnected(false);
            }
        );

        // Cleanup function to disconnect the WebSocket
        return () => {
            if (client && client.connected) {
                const payload = JSON.stringify(myDataRef.current);
                client.send('/app/disconnect', {}, payload);
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []); // Empty dependency array to run on mount/unmount

    useEffect(() => {
        if (stompClient && isConnected && myData && !isLoading) {
            const payload = JSON.stringify(myData);
            console.log(payload);
            stompClient.send('/app/validate.fingerprint', {}, payload);
        }
    }, [stompClient, myData, isConnected]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await configAxios.get("/users/my-e-signature/e-signature");
                setESignature(response.data?.data?.signature)
                setSignature(response.data?.data?.signature);
                setSignaturePreview(response.data?.data?.signature);
            } catch (error) {
                if (error.status === 404) {
                    console.log(error);
                    dispatch(showModal({ message: error?.response?.data?.message }))
                }
            }
        }

        if (validatedFingerprint) {
            if (validatedFingerprint.ip === myData.ip) {
                fetchData();
            }
        }
    }, [validatedFingerprint]);

    return (<>
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 border rounded-lg shadow-md w-96">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">E-Signature</h2>
            </div>
            <div className="w-full mb-6">
                {eSignature ? (
                    <img
                        src={eSignature}
                        alt="E-Signature"
                        className="w-full h-48 object-contain border border-gray-300 rounded"
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center border border-dashed border-gray-300 rounded bg-gray-50 text-gray-500">
                        Scan your Fingerprint
                    </div>
                )}
            </div>
            <button
                onClick={onOkClick}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
                OK
            </button>
        </div>
    </>);
}

export default Fingerprint;