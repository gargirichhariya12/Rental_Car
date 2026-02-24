import React from 'react'

const Heading = ({ heading }) => {
    return (
        <div className="mb-14">
      <h2 className="text-3xl font-semibold text-white text-center">
        {heading}
      </h2>

      {/* Red underline */}
      <div className="mt-2 mx-auto w-[220px] h-[2px] bg-red-600"></div>
    </div>
    );
};

export default Heading
