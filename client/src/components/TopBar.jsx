import React, { useEffect, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { MdMenuOpen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdNotificationsOutline, IoMdSettings } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { SetTheme } from "../redux/theme";
import { logout } from "./../redux/userSlice";
import { get_posts } from "../redux/postSlice";

const TopBar = ({ search }) => {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { token, successMessage, userDetails } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    let newData = data;
    dispatch(get_posts(newData));
  };

  const handleNavigate = () => {
    const newPath = "/message";
    navigate(newPath);
  };

  useEffect(() => {
    if (!token) {
      <Navigate to={"/login"} replace={true} />;
    }
  }, [successMessage, dispatch]);

  return (
    <div className="topbar w-full flex items-center justify-between md:py-4 py-2 px-4  bg-primary">
      <Link to="/" className="flex gap-2 items-center py-[8px]">
        <div className=" md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">Connectopia</span>
      </Link>
      {search !== "abc" && (
        <form className="hidden md:flex items-center justify-center" onSubmit={handleSubmit(handleSearch)}>
          <TextInput
            placeholder="Search..."
            styles="w-[16rem]  md:w-[25rem] lg:w-[30rem] rounded-l-full px-10"
            register={register("search")}
          />
          <CustomButton
            title="Search"
            type="submit"
            containerStyles="bg-[#0444a4] text-white px-6 mt-2 py-[11px] rounded-r-full"
          />
        </form>
      )}

      <div className="gap-16 hidden md:flex">
        <div className="hidden lg:flex text-lg text-ascent-1">
          <IoMdNotificationsOutline />
        </div>

        <button className=" text-ascent-1 text-md text-2xl" onClick={() => setOpen(!open)}>
          <IoMdSettings />
        </button>
        {/* ICONS */}
        {open && (
          <div className="absolute top-16 right-8 w-[220px] h-[220px] rounded-md  flex flex-col gap-6 bg-primary shadow-lg shadow-[#353434] items-center justify-center text-ascent-1 text-md md:text-xl">
            <button onClick={() => handleTheme()}>{theme ? <BsMoon /> : <BsSunFill />}</button>

            <button onClick={handleNavigate} className="text-ascent-1">
              <FaRegMessage />
            </button>

            <div>
              <CustomButton
                onClick={() => dispatch(logout())}
                title="Log Out"
                containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
              />
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden flex relative">
        <span onClick={() => setShow(!show)} className="text-2xl text-ascent-1 p-1">
          <MdMenuOpen />
        </span>
        {show && (
          <div className=" transition-all duration-500 ease-in-out absolute -top-3 -right-7  sm:w-[320px] w-[280px] h-[100vh] rounded-md bg-primary shadow-lg shadow-[#353434]">
            <span onClick={() => setShow(!show)} className="absolute top-2 left-2 text-xl p-1 text-ascent-1">
              <RxCross2 />
            </span>
            <div className="  flex flex-col gap-6 mt-10  items-center justify-center text-ascent-1 text-md text-xl">
              <Link to={`/profile/${userDetails._id}`}>Profile</Link>
              <button onClick={() => handleTheme()}>{theme ? <BsMoon /> : <BsSunFill />}</button>

              <button onClick={handleNavigate} className="text-ascent-1">
                <FaRegMessage />
              </button>
              <div>
                <CustomButton
                  onClick={() => dispatch(logout())}
                  title="Log Out"
                  containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
                />
              </div>
              {search !== "abc" && (
                <form
                  className="md:hidden flex items-center justify-center"
                  onSubmit={handleSubmit(handleSearch)}
                >
                  <TextInput
                    placeholder="Search..."
                    styles="w-[180px]  rounded-l-full px-5"
                    register={register("search")}
                  />
                  <CustomButton
                    title="Search"
                    type="submit"
                    containerStyles="bg-[#0444a4] text-white px-2 mt-2 py-[11px] rounded-r-full"
                  />
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
