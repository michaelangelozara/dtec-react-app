import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./Routes/AllRoutes";

const App = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  );
};

export default App;