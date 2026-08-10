import React, { useState } from "react";
import Sidebar from "./sidebar";

interface MainProps {
  children: React.ReactNode;
  initialExpanded: boolean;
}

export default function Main({ children, initialExpanded }: MainProps) {
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialExpanded);

  // Lógica de navegação para o Chevron
  // const handleBack = () => {
  //   if (typeof window !== "undefined" && window.history.length > 1) {
  //     router.back();
  //   } else {
  //     router.push("/");
  //   }
  // };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden text-zinc-900 font-sans">
      <div className="flex flex-1 overflow-hidden custom-scrollbar">
        <aside
          className={`hidden lg:block h-full border-0 border-zinc-100 bg-white transition-[width] duration-300 ease-in-out overflow-y-auto custom-scrollbar`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </aside>

        <main className="flex-1 overflow-y-auto bg-white custom-scrollbar scroll-smooth">
          <div className="max-w-340 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}