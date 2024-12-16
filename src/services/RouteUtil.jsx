import { officeInChargeRole, moderatorRole } from "./UserUtil";

export const navigateRouteByRole = (user) => {
    const role = user?.role;
    if (role === "STUDENT") {

    } else if (role === "PERSONNEL") {
        return "/user/dashboard";
    } else if (role === "STUDENT_OFFICER") {
        return "/user/dashboard";
    } else if (officeInChargeRole.includes(role)) {
        return "/oic/dashboard";
    }else if (moderatorRole.includes(role)) {
        return "/user/moderator-dashboard";
    }else {
        return "/admin/dashboard";
    }
}