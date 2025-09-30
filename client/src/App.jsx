import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryUI from "./DirectoryUI";
import { DirectoryContextProvider } from "./contexts/DirectoryContexts";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/*",
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
