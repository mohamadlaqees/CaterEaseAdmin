import { Link, NavLink } from "react-router";
import {
  Flag,
  Copyright,
  Inbox,
  LayoutDashboard,
  SquareMenu,
  UserCog,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { openSidebar } from "../store/sidebarSlice";

const LeftSideBar = ({ sidebarRef }) => {
  const sidebar = useRef();
  const { sidebarOpened } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebar.current &&
        !sidebar.current.contains(event.target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        dispatch(openSidebar({ sidebarOpened: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      ref={sidebar}
      className={`h-full bg-white  transition-all  z-50 ${
        sidebarOpened
          ? "  opacity-100 translate-x-0 "
          : " opacity-0 -translate-x-full  "
      } lg:opacity-100 lg:translate-x-0 fixed w-56 text-(--primaryFont) font-semibold`}
    >
      <h1
        className={`cursor-pointer transition-all 
             "opacity-0 pointer-events-none "
             "lg:opacity-100 lg:pointer-events-auto "
         shadow-sm  w-56 py-4 text-center text-2xl  font-serif font-semibold  text-white bg-(--primary) `}
      >
        <Link to={"./"}>CaterEase</Link>
      </h1>
      <span className=" right-0.5 top-[65px]  w-[2px] h-[91vh] absolute bg-(--border-color)" />
      <ul className=" mt-6 space-y-4 mx-4  ">
        <li>
          <NavLink
            className={({ isActive }) =>
              ` transition-all flex gap-4.5 p-3 rounded-md ${
                isActive
                  ? "bg-(--primary) text-white shadow-sm"
                  : "text-(--primaryFont)"
              } `
            }
            to={"./"}
            end
          >
            <LayoutDashboard />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              ` transition-all flex gap-4.5 p-3 rounded-md ${
                isActive
                  ? "bg-(--primary) text-white shadow-sm"
                  : "text-(--primaryFont)"
              } `
            }
            to={"./restaurants"}
          >
            <Copyright />
            Restaurants
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              ` transition-all flex gap-4.5 p-3 rounded-md ${
                isActive
                  ? "bg-(--primary) text-white shadow-sm"
                  : "text-(--primaryFont)"
              } `
            }
            to={"./owners"}
          >
            <UserCog />
            Owners{" "}
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              ` transition-all flex gap-4.5 p-3 rounded-md ${
                isActive
                  ? "bg-(--primary) text-white shadow-sm"
                  : "text-(--primaryFont)"
              } `
            }
            to={"./reviews"}
          >
            <Inbox />
            Reviews
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default LeftSideBar;
