import { useState } from "react";

function FollowButton({ username }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    // TODO: call API to follow/unfollow the user
    setIsFollowing(!isFollowing);
  };

  return (
    <button
      className={`btn ${isFollowing ? "btn-secondary" : "btn-outline-primary"}`}
      onClick={toggleFollow}
    >
      {isFollowing ? `Following ${username}` : `Follow ${username}`}
    </button>
  );
}

export default FollowButton;
