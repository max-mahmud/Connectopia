import React, { useEffect, useRef, useState } from "react";
import { Loading, TopBar } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { NoProfile } from "../assets";
import { FaPlus } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import io from "socket.io-client";
import { get_User } from "../redux/userSlice";
import { get_msg, messageClear, myUpdateMessage, send_message, updateMessage } from "./../redux/chatReducer";
const socket = io("https://cannecto.onrender.com");

const Message = () => {
  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [receverMessage, setReceverMessage] = useState("");
  const { userDetails } = useSelector((state) => state.user);
  const { message, successMessage, newMsg, loader } = useSelector((state) => state.chat);
  const [activeFriend, setActiveFriend] = useState([]);
  const [scrollContainerRef, setScrollContainerRef] = useState(null);
  let search = "abc";
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(get_User());
  }, []);
  useEffect(() => {
    setScrollContainerRef(document.getElementById("message-container"));
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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

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
      if (scrollContainerRef) {
        scrollContainerRef.scrollTop = scrollContainerRef.scrollHeight;
      }
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
  return (
    <div className="w-full  px-0 lg:px-10 md:pb-12 pb-2 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <div className="h-[17vh]">
        <TopBar search={search} />
      </div>

      <div className="w-full  flex gap-2 lg:gap-4 pb-7 h-[80vh] " ref={messageEndRef}>
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
        {id ? (
          <div
            id="message-container"
            style={{ overflowAnchor: "none" }}
            className="flex-1  w-full h-[80vh] p-5 flex flex-col gap-4 overflow-y-auto rounded-lg bg-primary m-2"
          >
            <h2 className=" w-[200px] py-1">
              {userDetails?.friends?.map((item) =>
                item._id === id ? (
                  <div className="flex gap-2 items-center text-lg text-ascent-1 font-medium">
                    <img
                      className="w-10 h-10 object-cover rounded-full"
                      src={item.profileUrl ? item.profileUrl : NoProfile}
                      alt="img"
                    />
                    {item.firstName}
                  </div>
                ) : (
                  ""
                )
              )}
            </h2>
            {loader ? (
              <div className="h-[80vh]">
                <Loading />
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto flex flex-col gap-3 bg-[#6a706544] px-4 py-4">
                {message.map((frnd, i) => (
                  <div key={i}>
                    {frnd?.senderId === userDetails?._id ? (
                      <div
                        ref={i === message.length - 1 ? messageEndRef : null}
                        className="w-full flex gap-2 justify-end items-center text-[14px]"
                      >
                        <div className="p-2 bg-[#0a3b86] text-white rounded-md">
                          <span>{frnd.message}</span>
                        </div>
                        <img
                          className="w-[30px] h-[30px] object-cover rounded-full"
                          src={userDetails?.profileUrl ? userDetails?.profileUrl : NoProfile}
                          alt="img"
                        />
                      </div>
                    ) : (
                      <div
                        ref={i === message.length - 1 ? messageEndRef : null}
                        className="w-full flex gap-2 justify-start items-center text-[14px]"
                      >
                        {userDetails?.friends?.map(
                          (item) =>
                            item._id === id && (
                              <img
                                className="w-[30px] h-[30px] object-cover rounded-full"
                                src={item.profileUrl ? item.profileUrl : NoProfile}
                                alt="img"
                              />
                            )
                        )}
                        <div className="p-2 bg-[#b9a013] text-white rounded-md">
                          <span>{frnd.message}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ==message form== */}
            <div className="flex p-2 justify-between items-center w-full ">
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
                <div onClick={send} className="text-2xl cursor-pointer text-ascent-1">
                  <BiSend />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`mt-2 flex-1  w-full h-[80vh] p-5 bg-primary pb-7  text-ascent-1 text-2xl flex justify-center items-center`}
          >
            <h4>Select A friend First</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
