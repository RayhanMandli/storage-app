import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryUI from "./DirectoryUI";
import { DirectoryContextProvider } from "./contexts/DirectoryContexts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Register from "./Register";
import Login from "./Login";
import AllUsers from "./AllUsers";
import AdminUserData from "./AdminUserData";
import SetPassword from "./SetPassword";
import Home from "./Home";
import Pricing from "./Pricing";
import About from "./About";
import Features from "./Features";

const App = () => {
    const client_id =
        "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com";
    const router = createBrowserRouter([
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/set-password",
            element: <SetPassword />,
        },
        {
            path: "/users",
            element: <AllUsers />,
        },
        {
            path: "/admin/users/:userId/data/*",
            element: <AdminUserData />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/pricing",
            element: <Pricing />,
        },
        {
            path: "/about",
            element: <About />,
        },
        {
            path: "/features",
            element: <Features />,
        },
        {
            path: "/*",
            element: <DirectoryUI />,
        },
        {
            path: "/home",
            element: <Home />,
        },
    ]);
    return (
        <GoogleOAuthProvider clientId={client_id}>
            <DirectoryContextProvider>
                <RouterProvider router={router} />
            </DirectoryContextProvider>
        </GoogleOAuthProvider>
    );
};

export default App;
