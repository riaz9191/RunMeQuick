import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000] z-50">
      <div className="flex items-center justify-center space-x-2">
        <div className="🤚">
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="🌴"></div>
          <div className="👍"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
