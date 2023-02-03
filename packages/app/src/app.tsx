import React from "react";
import {
  NavLink,
  Outlet,
  RouteObject,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { Drawer } from "./components/drawer";
import { ThemeSelectButton } from "./components/misc";
import * as stories from "./components/stories";

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

const router = createHashRouter([
  {
    element: <Root />,
    children: [
      ...storiesRoutes,
      {
        path: "*",
        element: <NotFound />,
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
        <div className="flex-none w-[250px] border-r">
          <div className="sticky top-0 p-1.5">
            <ul className="flex flex-col gap-1.5">
              {storiesRoutes.map((route) => (
                <li key={route.path} className="flex">
                  <NavLink
                    // https://github.com/ant-design/ant-design/blob/8bcd3c16a4760bf45d3d5c995f50a74a97e43de2/components/menu/style/index.tsx
                    className="flex-1 antd-btn antd-btn-text p-2 aria-current-page:(text-[var(--antd-colorPrimary)] bg-[var(--antd-controlItemBgActive)]) aria-current-page:dark:(text-white bg-[var(--antd-colorPrimary)])"
                    to={"/" + route.path}
                  >
                    {route.path}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
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

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="w-full flex justify-end items-center p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <button
        className="pl-1 pr-3 py-1 antd-btn antd-btn-ghost flex items-center"
        onClick={() => setMenuOpen(true)}
      >
        <span className="i-ri-menu-line w-5 h-5"></span>
      </button>
      <h1 className="text-xl">UnoCSS Ant Design</h1>
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
        <div className="h-full flex flex-col py-2 gap-4">
          <div className="flex-none pl-5 py-1">
            <button
              className="antd-btn antd-btn-ghost flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              <span className="i-ri-menu-line w-5 h-5"></span>
            </button>
          </div>
          <div className="flex-1 flex flex-col py-2 gap-4 overflow-x-auto">
            <div className="flex flex-col items-center gap-2 px-4">
              Drawer Example
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}

function NotFound() {
  return <div className="uppercase">select a story from menu</div>;
}
