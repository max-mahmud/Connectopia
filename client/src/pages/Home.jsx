import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import {
  RequestPending,
  accept_request,
  friend_request,
  get_User,
  get_friend_request,
  messageClear,
  suggested_friends,
  user_details,
} from "../redux/userSlice";
import { PostmessageClear, create_post, get_posts } from "../redux/postSlice";
import { toast } from "react-hot-toast";

const Home = () => {
  const {
    userDetails,
    userData,
    pendingRequest,
    edit,
    suggetedFriends,
    friendRequest,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.user);
  const { posts, postSuccess, postError, loader, postLoader } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(get_User());
  }, []);

  const handlePostSubmit = async (data) => {
    const newData = data;
    const fromData = new FormData();
    fromData.append("description", newData?.description);
    fromData.append("image", file);
    dispatch(create_post(fromData));
    reset();
    setFile(null);
  };

  useEffect(() => {
    dispatch(get_posts());
    dispatch(suggested_friends());
    dispatch(get_friend_request());
    dispatch(user_details());
  }, [dispatch, friend_request]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch, errorMessage]);

  useEffect(() => {
    if (postSuccess) {
      toast.success(postSuccess);
      dispatch(get_posts());
      dispatch(PostmessageClear());
    }
    if (postError) {
      toast.error(postError);
      dispatch(PostmessageClear());
    }
  }, [postSuccess, postError, dispatch]);
  let filterFriend = [];
  // useEffect(())
  filterFriend = pendingRequest?.map((item, i) => item?.requestTo);

  const handleFriendRequest = (id) => {
    dispatch(friend_request({ requestTo: id }));
    dispatch(RequestPending(id));
  };

  return (
    <>
      <div className="w-full px-3 md:px-4 lg:px-10 md:pb-12 pb-2 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-2 pb-10 h-full">
          {/* LEFT SIDE*/}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard userDetails={userData} />
            <FriendsCard friends={userDetails?.friends} />
          </div>

          {/* CENTER */}
          {postLoader ? (
            <div className="mb-2 bg-primary p-4 rounded-xl h-full flex-1">
              <Loading />
            </div>
          ) : (
            <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
              <form onSubmit={handleSubmit(handlePostSubmit)} className="bg-primary px-4 rounded-lg">
                <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                  <img
                    src={userDetails?.profileUrl ?? NoProfile}
                    alt="User_Image"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <TextInput
                    styles="w-full rounded-full py-5"
                    placeholder="What's on your mind...."
                    name="description"
                    register={register("description", {
                      required: "Write something about post",
                    })}
                    error={errors.description ? errors.description.message : ""}
                  />
                </div>
                {errMsg?.message && (
                  <span
                    role="alert"
                    className={`text-sm ${
                      errMsg?.status === "failed" ? "text-[#f64949fe]" : "text-[#2ba150fe]"
                    } mt-0.5`}
                  >
                    {errMsg?.message}
                  </span>
                )}

                <div className="flex items-center justify-between py-4">
                  <label
                    htmlFor="imgUpload"
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  >
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="imgUpload"
                      data-max-size="5120"
                      accept=".jpg, .png, .jpeg"
                    />
                    <BiImages />
                    <span>Image</span>
                  </label>

                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                    htmlFor="videoUpload"
                  >
                    {/* <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  /> */}
                    <BiSolidVideo />
                    <span>Video</span>
                  </label>

                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                    htmlFor="vgifUpload"
                  >
                    {/* <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    accept=".gif"
                  /> */}
                    <BsFiletypeGif />
                    <span>Gif</span>
                  </label>

                  <div>
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  </div>
                </div>
              </form>
              {file && (
                <div>
                  <img className="w-full mt-2 rounded-lg" src={URL.createObjectURL(file)} alt="" />
                </div>
              )}
              {posts?.length > 0 ? (
                <>
                  {loader && (
                    <div className="mb-2 bg-primary p-4 rounded-xl">
                      <Loading />
                    </div>
                  )}
                  {posts?.map((post) => (
                    <PostCard
                      key={post?._id}
                      userData={userData}
                      post={post}
                      loader={loader}
                      user={userDetails}
                    />
                  ))}
                </>
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-lg text-ascent-2">No Post Available</p>
                </div>
              )}
            </div>
          )}

          {/* RIFGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* FRIEND REQUEST */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest.length > 0
                  ? friendRequest?.map(({ _id, requestFrom: from }) => (
                      <div key={_id} className="flex items-center justify-between">
                        <Link
                          to={"/profile/" + from._id}
                          className="w-full flex gap-4 items-center cursor-pointer"
                        >
                          <img
                            src={from?.profileUrl ?? NoProfile}
                            alt={from?.firstName}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-base font-medium text-ascent-1">
                              {from?.firstName} {from?.lastName}
                            </p>
                            <span className="text-sm text-ascent-2">
                              {from?.profession ?? "No Profession"}
                            </span>
                          </div>
                        </Link>

                        <div className="flex gap-1">
                          <CustomButton
                            onClick={() => dispatch(accept_request({ rid: _id, status: "Accepted" }))}
                            title="Accept"
                            containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                          />
                          <CustomButton
                            onClick={() => dispatch(accept_request({ rid: _id, status: "Denied" }))}
                            title="Deny"
                            containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggetedFriends.length > 0
                  ? suggetedFriends?.map((friend) => (
                      <div className="flex items-center justify-between" key={friend._id}>
                        <Link
                          to={"/profile/" + friend?._id}
                          key={friend?._id}
                          className="w-full flex gap-4 items-center cursor-pointer"
                        >
                          <img
                            src={friend?.profileUrl ?? NoProfile}
                            alt={friend?.firstName}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <div className="flex-1 ">
                            <p className="text-base font-medium text-ascent-1">
                              {friend?.firstName} {friend?.lastName}
                            </p>
                            <span className="text-sm text-ascent-2">
                              {friend?.profession ?? "No Profession"}
                            </span>
                          </div>
                        </Link>

                        <div className="flex gap-1 ">
                          {filterFriend?.includes(friend?._id) ? (
                            <button
                              className="bg-[#0c661181] text-sm text-white p-1 rounded"
                              // onClick={() => dispatch(friend_request({ requestTo: friend?._id }))}
                            >
                              <FaUserCheck size={20} className="text-[#f2f3f5]" />
                            </button>
                          ) : (
                            <button
                              className="bg-[#0444a430]  text-sm text-white p-1 rounded"
                              onClick={() => handleFriendRequest(friend?._id)}
                            >
                              <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
        {edit && <EditProfile />}
      </div>
    </>
  );
};

export default Home;
