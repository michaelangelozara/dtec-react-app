import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginUserRoute, RegisterUserRoute, FirstTimeLoginRoute, ForgotPasswordRoute } from './Routes/LoginRoute';
import { AdminDashboardRoute, StudentListRoute, PersonnelListRoute, OICListRoute, OfficerListRoute, CoursesAndDepartmentListRoute, StudentManagementRoute, PersonnelManagementRoute, OicMangementRoute, UserListRoute, ClubListRoute, OICDashRoute } from './Routes/AdminRoute';
import { UserDashboardRoute, UserDocumentTrackingRoute, UserEClearanceRoute, UserDTTransactionRoute, LandingPageRoute } from './Routes/UserRoute';
import { ECRoute, ECOICRoute, ECMTRoute, OFORoute } from './Routes/DTECRoute';
import { ILICRoute, ILOCRoute, CLICRoute, CLOCRoute } from './Routes/LettersRoute';
import { PendingTransactionRoute } from './Routes/OICRoute';

const router = createBrowserRouter([
  LoginUserRoute,
  RegisterUserRoute,
  FirstTimeLoginRoute,
  ForgotPasswordRoute,
  UserDashboardRoute,
  UserDocumentTrackingRoute,
  UserDTTransactionRoute,
  UserEClearanceRoute,
  ECRoute,
  ECOICRoute,
  ECMTRoute,
  ILICRoute,
  ILOCRoute,
  CLICRoute,
  CLOCRoute,
  LandingPageRoute,
  OFORoute,
  AdminDashboardRoute,
  StudentListRoute,
  PersonnelListRoute,
  OICListRoute,
  OfficerListRoute,
  CoursesAndDepartmentListRoute,
  StudentManagementRoute,
  PersonnelManagementRoute,
  OicMangementRoute,
  UserListRoute,
  ClubListRoute,
  OICDashRoute,
  PendingTransactionRoute
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}