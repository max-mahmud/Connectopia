import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FriendsCard, Loading, PostCard, ProfileCard, TopBar } from "../components";
// import { posts } from "../assets/data";
import { get_post } from "../redux/postSlice";
import { get_User, profile_view } from "../redux/userSlice";
import { NoProfile } from "../assets";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { UserPost, postLoader } = useSelector((state) => state.posts);
  const [open, setopen] = useState(false);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  useEffect(() => {
    dispatch(get_post(id));
    dispatch(profile_view({ id: id }));
    dispatch(get_User(id));
  }, [id, dispatch]);

  return (
    <>
      <div className="home w-full px-3 lg:px-10 md:pb-12 pb-2 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-2 pb-10 h-full">
          {/* LEFT */}
          <div
            className={` ${
              open ? "absolute w-[320px]" : "hidden"
            } md:static top-0 right-0 bottom-0 left-1 z-50 md:w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto`}
          >
            <ProfileCard userDetails={userDetails} setopen={setopen} />

            <div className="block lg:hidden">
              <FriendsCard friends={userDetails?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            <div className="md:hidden flex  w-full bg-primary gap-5 justify-center p-3 flex-col items-center">
              <img
                className="w-[120px] h-[120px] object-cover rounded-full"
                src={userDetails?.profileUrl ? userDetails?.profileUrl : NoProfile}
                alt="img"
              />
              <span className="text-xl text-ascent-1">
                {userDetails?.firstName} {userDetails?.lastName}
              </span>
              <span onClick={() => setopen(!open)} className="text-xl text-ascent-1 bg-secondary px-4 py-2">
                See More
              </span>
            </div>
            {postLoader ? (
              <Loading />
            ) : UserPost?.length > 0 ? (
              UserPost?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={userDetails}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendsCard friends={userDetails?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
