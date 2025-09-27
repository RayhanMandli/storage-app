import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DirectoryUI from './DirectoryUI'

const App = () => {
  const router = createBrowserRouter([{
    path: "/*",
    element: <DirectoryUI/>
  }])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
