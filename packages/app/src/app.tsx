import { tw } from "@hiogawa/unocss-ts";
import React from "react";
import {
  NavLink,
  Outlet,
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { Drawer } from "./components/drawer";
import * as stories from "./components/stories";
import { ThemeSelectButton } from "./components/theme-select-button";
import { cls } from "./utils/misc";

export function App() {
  return <RouterProvider router={router} />;
}

//
// router
//

const storiesRoutes = Object.entries(stories).map(
  ([name, Fc]): RouteObject => ({
    path: name.slice(5),
    element: <Fc />,
  })
);

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      ...storiesRoutes,
      {
        path: "*",
        loader: () => redirect("/Button"),
      },
    ],
  },
]);

//
// Root
//

function Root() {
  return (
    <div className="h-full w-full flex flex-col relative">
      <Header />
      <div className="flex-1 flex">
        <div className="w-[250px] hidden md:block border-r p-1.5">
          <NavMenu />
        </div>
        <div className="flex-1">
          <div className="m-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavMenu({ onClick }: { onClick?: () => void }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {storiesRoutes.map((route) => (
        <li key={route.path} className="flex">
          <NavLink
            // https://github.com/ant-design/ant-design/blob/8bcd3c16a4760bf45d3d5c995f50a74a97e43de2/components/menu/style/index.tsx
            className={({ isActive }) =>
              cls(
                "antd-menu-item flex-1 p-2",
                isActive && "antd-menu-item-active"
              )
            }
            to={"/" + route.path}
            onClick={onClick}
          >
            {route.path}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="w-full flex justify-end items-center p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <button
        className="md:hidden pl-1 pr-3 py-1 antd-btn antd-btn-ghost flex items-center"
        onClick={() => setMenuOpen(true)}
      >
        <span className={tw.i_ri_menu_line.w_5.h_5.$}></span>
      </button>
      <h1 className="text-xl">UnoCSS AntDesign React</h1>
      <div className="flex-1"></div>
      <div className="flex gap-3 flex items-center">
        <ThemeSelectButton />
        <a
          className="flex items-center antd-btn antd-btn-ghost"
          href="https://github.com/hi-ogawa/unocss-preset-antd"
          target="_blank"
        >
          <span className="i-ri-github-line w-6 h-6"></span>
        </a>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="h-full flex flex-col gap-3 w-[250px]">
          <div className="flex-none pl-5 pt-3">
            <button
              className="antd-btn antd-btn-ghost flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              <span className="i-ri-menu-line w-5 h-5"></span>
            </button>
          </div>
          <div className="p-1.5 overflow-y-auto">
            <NavMenu onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      </Drawer>
    </header>
  );
}
