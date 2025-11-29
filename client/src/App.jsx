import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryUI from "./DirectoryUI";
import { DirectoryContextProvider } from "./contexts/DirectoryContexts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Register from "./Register";
import Login from "./Login";

const App = () => {
    const client_id =
        "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com";
    const router = createBrowserRouter([
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "*",
            element: <DirectoryUI />,
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
