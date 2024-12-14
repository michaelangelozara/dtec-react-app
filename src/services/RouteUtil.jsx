export const navigateRouteByRole = (user) => {
    const role = user?.role;
    if (role === "STUDENT") {

    } else if (role === "PERSONNEL") {
        return "/user/dashboard";
    } else if (role === "STUDENT_OFFICER") {
        return "/user/dashboard";
    } else if (role === "OFFICE_IN_CHARGE") {
        return "/oic/dashboard";
    }else if (role === "MODERATOR") {
        return "/user/moderator-dashboard";
    }else {
        return "/admin/dashboard";
    }
}