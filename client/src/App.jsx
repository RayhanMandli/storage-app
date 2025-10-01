import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryUI from "./DirectoryUI";
import { DirectoryContextProvider } from "./contexts/DirectoryContexts";
import Register from "./Register";
import Login from "./Login";

const App = () => {
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
    <DirectoryContextProvider>
      <RouterProvider router={router} />
    </DirectoryContextProvider>
  );
};

export default App;
