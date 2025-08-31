import { Bell, LogOut, Menu, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../store/sidebarSlice";
import { Link, useNavigate } from "react-router";
import Notifications from "./Notifications";
import { useLogOutMutation } from "../store/apiSlice/apiSlice";
import LoadingButton from "./LoadingButton";
import { Skeleton } from "@/components/ui/skeleton";

const HeaderBar = ({ sidebarRef }) => {
  const [logOut, { isLoading, error }] = useLogOutMutation();
  const dispatch = useDispatch();
  const { sidebarOpened } = useSelector((state) => state.sidebar);
  const [dropMenu, setDropMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const { unreadCount } = useSelector((state) => state.notification);
  const menu = useRef();
  const notification = useRef();
  const notificationBell = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menu.current && !menu.current.contains(event.target)) {
        setDropMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notification.current &&
        notificationBell.current &&
        !notification.current.contains(event.target) &&
        !notificationBell.current.contains(event.target)
      ) {
        setNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropMenuHandler = () => {
    setDropMenu((prev) => !prev);
  };
  const notificationsHandler = () => {
    setNotifications((prev) => !prev);
  };

  const logOuthandler = async () => {
    try {
      await logOut();
      if (!error) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <header className=" fixed w-full right-0 flex justify-between lg:justify-end pr-5 z-50 bg-white shadow-sm  lg:w-(--header-bar) h-[64px]">
        <h1 className="flex p-2  items-center lg:hidden shadow-sm gap-4  lg:gap-0  w-56 py-4 text-center text-2xl  font-serif font-semibold  text-white bg-(--primary) ">
          <Menu
            ref={sidebarRef}
            className="self-center sm:ml-4 cursor-pointer  "
            size={30}
            onClick={() =>
              dispatch(openSidebar({ sidebarOpened: !sidebarOpened }))
            }
          />
          <Link className="cursor-pointer" to={"./"}>
            CaterEase
          </Link>
        </h1>
        <div className="flex items-center gap-2 ">
          <div className="relative">
            <div ref={notificationBell} onClick={notificationsHandler}>
              <Bell
                className="relative text-(--primaryFont) cursor-pointer "
                size={30}
              />
              {unreadCount !== 0 && (
                <span className="absolute w-4 cursor-pointer text-xs text-center h-4 text-white  rounded-full bg-(--primary) top-0 right-0">
                  {unreadCount}
                </span>
              )}
            </div>
            <Notifications
              isOpen={notifications}
              notificationsRef={notification}
            />
          </div>
          <div className="relative" ref={menu}>
            <div
              className="flex gap-5 items-center px-4  cursor-pointer"
              onClick={dropMenuHandler}
            >
              <img
                src={"/admin.webp"}
                alt=""
                className="sm:w-12 sm:h-12 w-10 h-10 rounded-full"
              />
              <div className="hidden sm:block">
                <h3 className="text-(--primaryFont)">{"Admin"}</h3>
                <p className="text-center text-(--secondaryFont)">admin</p>
              </div>
            </div>
            {isLoading && (
              <div className="flex gap-2 items-center  cursor-pointer">
                <Skeleton className="sm:w-12 sm:h-12 w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            )}
            <div
              className={` text-sm sm:text-base  ${
                dropMenu
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              } text-(--primaryFont) absolute  border-3 border-(--border-color) top-13 w-40 transition-all rounded-md -right-[10px] bg-white h-fit space-y-2 `}
            >
              <div
                className={`sm:hidden text-sm p-2 mb-0 text-center border-b-1 m w-full `}
              >
                <h3 className="text-(--primaryFont)">Admin</h3>
              </div>
              <div
                className={`p-2 flex justify-center  transition-all cursor-pointer  hover:bg-accent w-full  text-[#e75858]`}
              >
                {" "}
                <button
                  className=" cursor-pointer w-28 flex justify-between gap-2.5"
                  onClick={logOuthandler}
                >
                  {!isLoading && <LogOut />}
                  <LoadingButton
                    isButton={false}
                    btnClass={"bg-none"}
                    disabled={isLoading}
                    loadingText={"Loging Out..."}
                    text={"LogOut"}
                    spinColor="text-[#e75858]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderBar;
