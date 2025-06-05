import { useState, useEffect } from "react";
import { AuthService } from "../Login.js";

function FollowButton({ username, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!AuthService.isLoggedIn(); // Convert to boolean
  const auth = AuthService.getAuth();
  const currentUserId = auth?.id;
  const token = auth?.token;

  // Debug logging
  console.log("FollowButton Debug:", {
    username,
    targetUserId,
    isLoggedIn,
    currentUserId,
    token: token ? "exists" : "missing",
    shouldRender: isLoggedIn && targetUserId && currentUserId !== targetUserId,
  });

  // Check initial following status when component mounts
  useEffect(() => {
    if (
      isLoggedIn &&
      currentUserId &&
      targetUserId &&
      currentUserId !== targetUserId
    ) {
      checkFollowingStatus();
    }
  }, [isLoggedIn, currentUserId, targetUserId]);

  const checkFollowingStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/${currentUserId}/following/${targetUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const toggleFollow = async () => {
    if (!isLoggedIn) {
      alert("Please log in to follow users");
      return;
    }

    setLoading(true);

    try {
      const url = isFollowing
        ? `http://localhost:8080/api/user/unfollow/${currentUserId}`
        : `http://localhost:8080/api/user/follow/${currentUserId}`;

      const method = isFollowing ? "DELETE" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: targetUserId.toString() }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Failed to update follow status");
        alert("Failed to update follow status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Don't render if no target user ID
  if (!targetUserId) {
    return null;
  }

  // Don't render if viewing own catalog
  if (currentUserId === targetUserId) {
    return null;
  }

  return (
    <button
      className={`btn ${isFollowing ? "btn-secondary" : "btn-outline-primary"}`}
      onClick={toggleFollow}
      disabled={loading}
    >
      {loading
        ? "Loading..."
        : isFollowing
        ? `Following ${username}`
        : `Follow ${username}`}
    </button>
  );
}

export default FollowButton;
