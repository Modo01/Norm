import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Lazy loaded components
const Login = React.lazy(() => import("./Component/pages/login/Login"));
const MainLayout = React.lazy(() => import("./Component/layout/home"));
const List = React.lazy(() => import("./Component/pages/list"));
const AddNorm = React.lazy(() => import("./Component/pages/addNorm"));
const PlanList = React.lazy(() => import("./Component/pages/planList"));
const Planning = React.lazy(() => import("./Component/pages/planning"));
const Home = React.lazy(() => import("./Component/pages/home"));
const Register = React.lazy(() =>
  import("./Component/pages/register/register")
);

const NormRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "normList", element: <List /> },
        { path: "addNorm", element: <AddNorm /> },
        { path: "planList", element: <PlanList /> },
        { path: "planning", element: <Planning /> },
        { path: "home", element: <Home /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default NormRoutes;
