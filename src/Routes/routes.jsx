import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Shared/Login";
import SignUp from "../Pages/Shared/SignUp";
import CodeExecution from "../Pages/CodeExecution/CodeExecution";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children:[
      {
        path:'/',
        element: <Home/>
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "/codeExecution",
        element: <CodeExecution/>,
      },
      
    ]
  },
]);
