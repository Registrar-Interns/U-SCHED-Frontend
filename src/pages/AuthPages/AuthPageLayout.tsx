import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full h-screen">
      {/* Left Section (Limited Width Background Image) */}
      <div className="hidden lg:flex items-center justify-center lg:w-[70%]">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('/images/pnc-bg.jpg')" }}
        ></div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="flex items-center justify-center w-full lg:w-[30%] h-full bg-white dark:bg-gray-900 p-8">
        <div className="max-w-md w-full">{children}</div>
      </div>

      {/* Theme Toggler */}
      <div className="fixed z-50 bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
