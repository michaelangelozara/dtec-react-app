export const navigateRouteByRole = (user) => {
    const role = user.role;
    if (role === "STUDENT") {

    } else if (role === "PERSONNEL") {

    } else if (role === "STUDENT_OFFICER") {

    } else if (role === "OFFICE_IN_CHARGE") {

    } else {
        return "/admin/dashboard";
    }
}