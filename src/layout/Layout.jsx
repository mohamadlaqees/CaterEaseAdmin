import { Outlet } from "react-router";
import HeaderBar from "../components/HeaderBar";
import LeftSideBar from "../components/LeftSideBar";
import { useRef } from "react";

const Layout = () => {
  const burgerRef = useRef();

  return (
    <>
      <main>
        <LeftSideBar sidebarRef={burgerRef} />
        <section>
          <HeaderBar sidebarRef={burgerRef} />
          <main className="  lg:pl-56 pt-[65px] ">
            <Outlet />
          </main>
        </section>
      </main>
    </>
  );
};

export default Layout;
