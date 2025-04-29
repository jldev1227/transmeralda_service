"use client";

import React, { useState } from "react";
import { Home, Menu, X, ChevronDown, CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

interface NavigationItem {
  icon: React.ReactNode; // Mejor que 'any' para elementos React
  name: string;
  path: string;
  submenu?: any[];
  active: boolean;
  disabled?: boolean; // Propiedad opcional
}

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(
    null,
  );

  const router = useRouter();
  const pathname = usePathname();

  // Simular el path actual (en una app real vendría del router)
  const [currentPath, setCurrentPath] = useState<string | null>(pathname);

  const navigation: NavigationItem[] = [
    {
      name: "Inicio",
      path: "/",
      icon: <Home size={20} />,
      active: currentPath === "/",
    },
  ];

  const handleNavigation = (path: string, disabled = false) => {
    if (disabled) {
      alert("Esta sección estará disponible próximamente");

      return;
    }
    router.push(path);
    setCurrentPath(path);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index: string | number | null) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto max-xl:px-4">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <Link className="flex" href={"/"}>
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-emerald-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="ml-2 text-gray-900 font-semibold text-lg">
                  Gestión de Servicios
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 lg:items-center">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative inline-block text-left">
                <div>
                  <button
                    className={`
                      group inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${
                        item.active
                          ? "text-emerald-600 bg-emerald-50"
                          : item.disabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                      }
                    `}
                    type="button"
                    onClick={() =>
                      item.submenu && item.submenu.length > 0
                        ? toggleDropdown(index)
                        : handleNavigation(item.path, item.disabled)
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                    {item.submenu && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === index ? "transform rotate-180" : ""}`}
                      />
                    )}
                  </button>
                </div>

                {/* Dropdown for submenu items */}
                {item.submenu && activeDropdown === index && (
                  <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      aria-labelledby="options-menu"
                      aria-orientation="vertical"
                      className="py-1"
                      role="menu"
                    >
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.name}
                          className={`
                            flex w-full px-4 py-2 text-sm
                            ${
                              item.disabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                            }
                          `}
                          role="menuitem"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(subItem.path, item.disabled);
                          }}
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="group inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700"
              type="button"
            >
              <span className="mr-2">!Hola {user?.nombre}</span>
              <CircleUserRound size={28} />
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <div>
              <div className="w-full flex items-center pl-3 pr-4 py-2 text-base font-medium rounded-md text-gray-700">
                <span className="mr-2">
                  <CircleUserRound size={24} />
                </span>
                !Hola {user?.nombre}
              </div>
            </div>
            {navigation.map((item, index) => (
              <div key={item.name}>
                <button
                  className={`
                    w-full flex items-center pl-3 pr-4 py-2 text-base font-medium rounded-md
                    ${
                      item.active
                        ? "text-emerald-600 bg-emerald-50"
                        : item.disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                    }
                  `}
                  onClick={() =>
                    item.submenu
                      ? toggleDropdown(index)
                      : handleNavigation(item.path, item.disabled)
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  {item.submenu && (
                    <ChevronDown
                      className={`ml-auto h-5 w-5 transition-transform ${activeDropdown === index ? "transform rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Mobile submenu */}
                {item.submenu && activeDropdown === index && (
                  <div className="pl-12 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.name}
                        className={`
                          block py-2 text-base font-medium
                          ${
                            item.disabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:text-emerald-600"
                          }
                        `}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(subItem.path, item.disabled);
                        }}
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breadcrumb - Optional */}
      <div className="bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-2 max-xl:px-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-3 text-sm">
              <li className="flex items-center">
                <button
                  className="text-gray-500 hover:text-emerald-600"
                  onClick={() => handleNavigation("/")}
                >
                  <Home size={16} />
                  <span className="sr-only">Inicio</span>
                </button>
              </li>
              <li className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="ml-4 text-gray-700 font-medium">
                  {navigation.find((item) => item.path === currentPath)?.name ||
                    "Página Actual"}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
