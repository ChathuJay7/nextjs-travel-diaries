import React from 'react';

const Button = (props) => {

  const extraClasses = props?.className || '';

  return (
    <button {...props} disabled={props.disabled} className={'flex gap-2 items-center py-1 px-4 rounded-md text-opacity-90 ' + extraClasses + (props.primary ? ' bg-[#218b56] text-white border-solid border-2 border-[#218b56] hover:text-[#218b56] hover:bg-white' :  'text-gray-600 border-solid border-2 border-[#218b56] hover:bg-[#218b56] hover:text-white') + (props.disabled ?   ' text-opacity-70 bg-opacity-70 cursor-not-allowed' : '') + (props.loginBtn ? ' text-red-400 border-solid border-2 border-red-400 hover:bg-red-400 hover:border-white' : ' ') } />
  );
};

export default Button;
