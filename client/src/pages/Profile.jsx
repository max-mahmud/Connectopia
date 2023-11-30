import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FriendsCard, Loading, PostCard, ProfileCard, TopBar } from "../components";
import { posts } from "../assets/data";
import { get_post } from "../redux/postSlice";
import { profile_view } from "../redux/userSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { UserPost } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(userDetails);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  useEffect(() => {
    dispatch(get_post(id));
    dispatch(profile_view({ id: id }));
  }, []);

  // useEffect(() => {
  //   dispatch(get_post(id));
  // }, []);

  return (
    <>
      <div className="home w-full px-0 lg:px-10 md:pb-12 pb-2 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-2 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />

            <div className="block lg:hidden">
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            {loading ? (
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
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
