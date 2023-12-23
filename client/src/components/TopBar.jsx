import React, { useEffect, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline, IoMdSettings } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { SetTheme } from "../redux/theme";
import { logout } from "./../redux/userSlice";
import { get_posts } from "../redux/postSlice";

const TopBar = ({ search }) => {
  const { theme } = useSelector((state) => state.theme);
  const { token, successMessage } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (!token) {
      <Navigate to={"/login"} replace={true} />;
    }
  }, [successMessage, dispatch]);

  return (
    <div className="topbar w-full flex items-center justify-between py-2 md:py-4 px-4 bg-primary">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">Connectopia</span>
      </Link>
      {search !== "abc" && (
        <form className="hidden md:flex items-center justify-center" onSubmit={handleSubmit(handleSearch)}>
          <TextInput
            placeholder="Search..."
            styles="w-[18rem] lg:w-[38rem]  rounded-l-full px-10"
            register={register("search")}
          />
          <CustomButton
            title="Search"
            type="submit"
            containerStyles="bg-[#0444a4] text-white px-6 py-[11px] mt-2 rounded-r-full"
          />
        </form>
      )}

      <div className="flex gap-16">
        <div className="hidden lg:flex text-lg text-ascent-1">
          <IoMdNotificationsOutline />
        </div>

        <button className=" text-ascent-1 text-md md:text-xl" onClick={() => setOpen(!open)}>
          <IoMdSettings />
        </button>
        {/* ICONS */}
        {open && (
          <div className="absolute top-16 right-8 w-[220px] h-[220px] rounded-md  flex flex-col gap-6 bg-primary shadow-lg shadow-[#353434] items-center justify-center text-ascent-1 text-md md:text-xl">
            <button onClick={() => handleTheme()}>{theme ? <BsMoon /> : <BsSunFill />}</button>

            <Link to="/message" className="text-ascent-1">
              <FaRegMessage />
            </Link>

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
    </div>
  );
};

export default TopBar;
