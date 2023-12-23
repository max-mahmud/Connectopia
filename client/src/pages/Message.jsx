import React, { useEffect, useRef, useState } from "react";
import { TopBar } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { NoProfile } from "../assets";
import { FaPlus } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import io from "socket.io-client";
import { get_User } from "../redux/userSlice";
import { get_msg, messageClear, myUpdateMessage, send_message, updateMessage } from "./../redux/chatReducer";
const socket = io("http://localhost:8800");

const Message = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [receverMessage, setReceverMessage] = useState("");
  const { userDetails } = useSelector((state) => state.user);
  const { message, successMessage, newMsg } = useSelector((state) => state.chat);
  const [activeFriend, setActiveFriend] = useState([]);
  let search = "abc";
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(get_User());
  }, []);

  useEffect(() => {
    socket.emit("add_user", userDetails._id, {
      firsrName: userDetails.firstName,
      lastName: userDetails.lastName,
    });
  }, [userDetails]);
  useEffect(() => {
    socket.on("activeFriend", (activeUsers) => {
      setActiveFriend(activeUsers);
    });
  }, [userDetails]);
  const send = () => {
    if (text.trim() !== "") {
      dispatch(
        send_message({
          userId: userDetails._id,
          text,
          receverId: id,
          name: userDetails.firstName,
        })
      );
      setText("");
    }
  };

  useEffect(() => {
    socket.on("friend_message", (msg) => {
      setReceverMessage(msg);
    });
  }, []);

  useEffect(() => {
    if (userDetails._id === newMsg.senderId) {
      dispatch(myUpdateMessage(newMsg));
      dispatch(messageClear());
    }
  }, [newMsg, userDetails._id]);

  useEffect(() => {
    if (successMessage) {
      socket.emit("send_friend_message", newMsg);
      dispatch(messageClear());
    }
  }, [successMessage]);

  useEffect(() => {
    dispatch(get_msg(id));
  }, [id]);

  useEffect(() => {
    if (receverMessage) {
      if (id === receverMessage.senderId && userDetails._id === receverMessage.receverId) {
        dispatch(updateMessage(receverMessage));
      }
    }
  }, [receverMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="w-full  px-0 lg:px-10 md:pb-12 pb-2 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar search={search} />
      <div className="w-full  pt-[75px] flex gap-2 lg:gap-4 pb-10 h-full">
        {/* ==Left== */}
        <div className="hidden w-1/3 lg:w-1/4 h-[80vh] p-5 md:flex flex-col gap-6 overflow-y-auto bg-primary mt-2">
          {userDetails?.friends?.map((frnd, i) => (
            <Link
              to={"/message/" + frnd?._id}
              key={frnd?._id}
              className="w-full flex gap-4 items-center cursor-pointer "
            >
              <div className="relative">
                <img
                  src={frnd?.profileUrl ?? NoProfile}
                  alt={frnd?.firstName}
                  className="w-10 h-10 object-cover rounded-full"
                />
                {activeFriend.some((c) => c?.id === frnd?._id) && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#279b17] absolute right-0 bottom-0"></div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {frnd?.firstName} {frnd?.lastName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* ==Right== */}
        <div className="flex-1 w-full h-[80vh] p-5 flex flex-col gap-6 overflow-y-auto rounded-lg bg-primary m-2">
          <h2 className="bg-[#6a706544] w-[200px] py-1">Hello 222222</h2>
          <div className="w-full h-full overflow-y-auto flex flex-col gap-3">
            {message.map((frnd, i) => (
              <div key={i}>
                {frnd?.senderId === userDetails?._id ? (
                  <div ref={scrollRef} className="w-full flex gap-2 justify-start items-center text-[14px]">
                    <img className="w-[30px] h-[30px] " src={NoProfile} alt="" />
                    <div className="p-2 bg-[#6d6d6d] text-white rounded-md">
                      <span>{frnd.message}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    // ref={scrollRef}
                    className="w-full flex gap-2 justify-end items-center text-[14px]"
                  >
                    <div className="p-2 bg-[#6d6d6d] text-white rounded-md">
                      <span>{frnd.message}</span>
                    </div>
                    <img className="w-[30px] h-[30px] " src={NoProfile} alt="" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* ==message form== */}
          <div className="flex p-2 justify-between items-center w-full">
            <div className="w-[40px] h-[40px] border p-2 justify-center items-center flex bg-white rounded-full">
              <label className="cursor-pointer" htmlFor="">
                <FaPlus />
              </label>
              <input className="hidden" type="file" />
            </div>
            <div className="border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="input message"
                className="w-full rounded-full h-full outline-none p-3"
              />
              <div className="text-2xl right-2 top-2 absolute cursor-auto">
                <span>
                  <MdEmojiEmotions />
                </span>
              </div>
            </div>
            <div className="w-[40px] p-2 justify-center items-center rounded-full">
              <div onClick={send} className="text-2xl cursor-pointer">
                <BiSend />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
