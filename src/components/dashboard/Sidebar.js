import React, { useState, useEffect } from "react";
import { sidebarLinks as LINKS } from "../../data/dashboard-links";
import SidebarLinks from "./SideBarLinks";
import { VscSignOut } from "react-icons/vsc";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useAccountType } from "./AccountTypeContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [clicked, setClicked] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { accountType } = useAccountType();
  const navigate = useNavigate();
  const normalizedAccountType = accountType.toLowerCase();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setClicked(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <div
          className={`flex flex-col transition-all ease-out duration-200 border-r-[1px] border-richblack-700 bg-blue-rgb(8, 143, 143) h-full py-10 fixed z-[100] ${
              clicked ? "w-64" : "w-16"
          } ${
              clicked ? "left-0" : "left-[-200px]"
          } md:relative md:left-0 md:w-64 ${
              windowWidth < 768 && clicked ? "shadow-lg" : ""
          } sidebar`}
      >
        <button
            onClick={() => setClicked((prev) => !prev)}
            className="absolute text-[25px] visible md:hidden top-2 right-[-20px] z-[1000] text-red-500"
            aria-label={clicked ? "Close sidebar" : "Open sidebar"}
        >
          {!clicked ? <FaArrowAltCircleRight /> : <IoMdCloseCircle />}
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
          {LINKS.map((link) => {
            if (link.type && link.type.toLowerCase() !== normalizedAccountType) {
              return null;
            }
            return (
                <SidebarLinks
                    setClicked={setClicked}
                    key={link.id}
                    iconName={link.icon}
                    link={link}
                    collapsed={!clicked && windowWidth < 768}
                />
            );
          })}
        </div>

        <div className="mx-auto mt-auto mb-6 h-[1px] w-10/12 bg-richblack-600">
          <button
              onClick={handleLogout}
              className={`flex text-center text-[13px] px-6 py-2 hover:cursor-pointer hover:scale-95 transition-all duration-200 rounded-md font-bold bg-red-500 text-black items-center gap-x-2 justify-center log-out ${
                  !clicked && windowWidth < 768 ? "mx-auto p-2" : "w-10/12 mx-auto"
              }`}
          >
            <VscSignOut className="text-lg" />
            <span className={`${!clicked && windowWidth < 768 ? "hidden" : "block"}`}>
            Logout
          </span>
          </button>
        </div>

        <style jsx>{`
        .log-out {
          width: 100%;
          border-radius: 10px;
        }
        html, body {
          height: 100%;
          margin: 0;
        }
        .sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 5px;
        }
        .sidebar {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 transparent;
        }
      `}</style>
      </div>
  );
};

export default Sidebar;
