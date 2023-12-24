import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { BsBriefcase, BsFacebook, BsInstagram } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { NoProfile } from "../assets";
import { get_User } from "../redux/userSlice";
import EditProfile from "./EditProfile";

const ProfileCard = ({ userDetails, setopen }) => {
  const [show, setShow] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // console.log(pathname);
  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 ">
        <span
          onClick={() => setopen(false)}
          className="absolute md:hidden top-1 right-1 text-2xl p-1 text-ascent-1"
        >
          <RxCross2 />
        </span>
        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
          <Link to={"/profile/" + userDetails?._id} className="flex gap-2">
            <img
              src={userDetails?.profileUrl ?? NoProfile}
              alt={userDetails?.email}
              className="w-14 h-14 object-cover rounded-full"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {userDetails?.firstName} {userDetails?.lastName}
              </p>
              <span onClick={() => dispatch(get_User())} className="text-ascent-2">
                {userDetails?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className="">
            {
              pathname == "/" && (
                <LiaEditSolid
                  onClick={() => setShow(!show)}
                  size={22}
                  className="text-blue hover:text-white cursor-pointer"
                />
              ) //: (
              //   <button className="bg-[#0444a430] text-sm text-white p-1 rounded" onClick={() => {}}>
              //     <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
              //   </button>
              // )
            }
          </div>
        </div>

        {/* ================ */}
        {show && <EditProfile show={show} setShow={setShow} />}
        {/* ======================= */}

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{userDetails?.location ?? "Add Location"}</span>
          </div>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className=" text-lg text-ascent-1" />
            <span>{userDetails?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold">{userDetails?.friends?.length} Friends</p>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Who viewed your profile</span>
            <span className="text-ascent-1 text-lg">{userDetails?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {userDetails?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Joined</span>
            <span className="text-ascent-1 text-base">{moment(userDetails?.createdAt).fromNow()}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 py-4 pb-6">
          <p className="text-ascent-1 text-lg font-semibold">Social Profile</p>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsInstagram className=" text-xl text-ascent-1" />
            <span>Instagram</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <FaTwitterSquare className=" text-xl text-ascent-1" />
            <span>Twitter</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsFacebook className=" text-xl text-ascent-1" />
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
