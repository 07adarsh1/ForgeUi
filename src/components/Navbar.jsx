import React from 'react'
import { MdHistory } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleHistory }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-gray-800">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/')} className="icon cursor-pointer hover:text-white transition-colors">
            <IoArrowBack />
          </div>
          <div onClick={() => navigate('/')} className="logo cursor-pointer">
            <h3 className='text-[25px] font-[700] sp-text'>GenUI</h3>
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