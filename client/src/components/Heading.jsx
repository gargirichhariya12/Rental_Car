import React from 'react'

const Heading = ({ heading, className = '', titleClassName = '', underlineClassName = '' }) => {
    return (
        <div className={`mb-14 ${className}`.trim()}>
      <h2 className={`text-3xl font-semibold text-white text-center ${titleClassName}`.trim()}>
        {heading}
      </h2>

      <div className={`mt-2 mx-auto w-[220px] h-[2px] bg-red-600 ${underlineClassName}`.trim()}></div>
    </div>
    );
};

export default Heading
