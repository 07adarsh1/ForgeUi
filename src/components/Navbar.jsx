import React from 'react'
import { MdHistory } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleHistory }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="nav flex items-center justify-between px-6 md:px-12 lg:px-[100px] h-20 md:h-[90px] border-b-[1px] border-gray-800">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/')} className="icon cursor-pointer hover:text-white transition-colors">
            <IoArrowBack />
          </div>
          <div onClick={() => navigate('/')} className="logo cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="ForgeUI Logo" className="w-10 h-10 object-contain rounded-full" />
            <h3 className='text-[24px] font-bold tracking-tight text-white'>ForgeUI</h3>
          </div>
        </div>

        <div className="icons flex items-center gap-[15px]">
          <div onClick={toggleHistory} className="icon hover:text-purple-500 transition-colors cursor-pointer"><MdHistory /></div>
        </div>
      </div>
    </>
  )
}

export default Navbar