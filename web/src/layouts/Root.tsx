import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import useResponsiveWidth from "@/hooks/useResponsiveWidth";

function Root() {
  const { sm } = useResponsiveWidth();

  return (
    <div className="w-full min-h-full">
      <div className="w-full sm:pl-56 mx-auto flex flex-row justify-center items-start">
        {sm && (
          <div className="hidden sm:block fixed top-0 left-0 w-56 border-r dark:border-zinc-800 h-full bg-zinc-50 dark:bg-zinc-700 dark:bg-opacity-40 transition-all hover:shadow-xl">
            <Navigation />
          </div>
        )}
        <main className="w-full h-auto flex-grow shrink flex flex-col justify-start items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Root;
