import React, { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Link, NavLink } from "react-router-dom";
import "./navbar.css";
import Spinner from "./Spinner";
import img1 from "icon.png";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Spinner className="text-center" animation="border" variant="primary" />
    );
  }

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((err) => {
        console.log(err);
      });
  };

  const navOps = (
    <>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "default")}
          to={"/"}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "default")}
          to={"/codeExecution"}
        >
          Code Execution
        </NavLink>
      </li>

      {user?.email ? (
        <ul className="lg:flex">
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "default")}
              to={"/previousExecutions"}
            >
              Previous Executions
            </NavLink>
          </li>
        </ul>
      ) : (
        <p></p>
      )}
    </>
  );
  return (
    <div>
      <div className="navbar bg-white  text-white rounded-b-xl fixed z-20 bg-opacity-10 backdrop-filter backdrop-blur-sm max-w-screen-xl lg:text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="text-black menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navOps}
            </ul>
          </div>
          <Link to="/">
            {" "}
            <a className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-[#ddae13] to-[#f25353] bg-clip-text text-transparent">
              <img className="w-14 h-14 " src={img1} alt="" />
            </a>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navOps}</ul>
        </div>
        <div className="navbar-end">
          {user?.email ? (
            <Link to="/">
              {/* <a
                onClick={handleLogOut}
                className="btn bg-gradient-to-r from-[#8c3e91] to-[#3a3b79] text-white
                      hover:from-[#3a3b79] hover:to-[#8c3e91] transition-all duration-300 shadow-xl rounded-md"
              >
                Logout
              </a> */}
              {/* <button  onClick={handleLogOut} className="button type1"></button> */}
              <button onClick={handleLogOut} className="Btn">Logout</button>
              
            </Link>
          ) : (
            <Link to="/login">
              {/* <button className="login">HOVER ME</button> */}
              {/* <button className="login"> Button</button> */}
              
              <div className="containerz">
                <div className="zoxy">
                  <a href="#">Login</a>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
