import React from "react";

export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none"></div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a href="https://github.com/pjvperes/alc" target="_blank" rel="noreferrer" className="link">
                GitHub Repo
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
