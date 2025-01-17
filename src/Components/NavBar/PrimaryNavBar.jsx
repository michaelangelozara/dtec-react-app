import { FaUserCircle, FaBell } from "react-icons/fa";
import Banner from "../../Images/banner.svg";

// svgs
import Logout from "../../assets/icons/Logout.svg"

import axios from "../../api/AxiosConfig";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../states/slices/UserSlicer";

import { handleLogout } from "../../services/TokenUtils";

function PrimaryNavBar() {
    const dispatch = useDispatch();


    const logoutHandler = async () => {
        try {
            const response = await axios.post("/auth/logout");
            if (response.status === 200) {
                dispatch(deleteUser());
                handleLogout();
            }
        } catch (error) {
        }
    }

    return (<>
        <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
            <img src={Banner} alt="DTEC Logo" className="h-16" />
            <div className="flex items-center space-x-4">
                {/* <FaBell className="text-white text-xl" />
                <FaUserCircle className="text-white text-2xl" /> */}
                <img className="size-7" src={Logout} alt="Log out" onClick={logoutHandler} />
            </div>
        </div>
    </>);
}

export default PrimaryNavBar;