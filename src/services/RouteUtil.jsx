import { officeInChargeRole, moderatorRole } from "./UserUtil";

export const navigateRouteByRole = (user) => {
    const role = user?.role;
    if (role === "STUDENT" || role === "PERSONNEL") {
        return "/user/e-clearance";
    } else if (role === "STUDENT_OFFICER") {
        return "/user/dashboard";
    } else if (officeInChargeRole.includes(role)) {
        return "/oic/dashboard";
    } else if (moderatorRole.includes(role)) {
        return "/user/moderator-dashboard";
    } else {
        return "/admin/dashboard";
    }
}