import { useState } from "react";
import { useParams } from "react-router-dom";
import CatalogTabs from "./catalog/CatalogTabs";
import CatalogGrid from "./catalog/CatalogGrid";
import CatalogReviewsGrid from "./catalog/CatalogReviewsGrid";
import FollowButton from "./catalog/FollowButton";

// Temp data for development
const TEMP_USER = {
  userName: "musiclover66",
  id: 1,
};

const TEMP_LISTENED_ALBUMS = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    artUrl: "http://dummyimage.com/100x100.png/cc0000/ffffff",
  },
  {
    id: 2,
    title: "Thriller",
    artist: "Michael Jackson",
    artUrl: "http://dummyimage.com/100x100.png/ff4444/ffffff",
  },
  {
    id: 3,
    title: "Abbey Road",
    artist: "The Beatles",
    artUrl: "http://dummyimage.com/100x100.png/dddddd/000000",
  },
  {
    id: 4,
    title: "Nevermind",
    artist: "Nirvana",
    artUrl: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
  },
];

const TEMP_WANT_TO_LISTEN_ALBUMS = [
  {
    id: 5,
    title: "OK Computer",
    artist: "Radiohead",
    artUrl: "http://dummyimage.com/100x100.png/ff4444/ffffff",
  },
  {
    id: 6,
    title: "Back in Black",
    artist: "AC/DC",
    artUrl: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
  },
  {
    id: 7,
    title: "The Joshua Tree",
    artist: "U2",
    artUrl: "http://dummyimage.com/100x100.png/dddddd/000000",
  },
  {
    id: 8,
    title: "Rumours",
    artist: "Fleetwood Mac",
    artUrl: "http://dummyimage.com/100x100.png/cc0000/ffffff",
  },
];

const TEMP_REVIEWS = [
  {
    id: 1,
    content:
      "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
    stars: 1,
    likes: 23,
    likedByCurrentUser: true,
    user: {
      id: 1,
      userName: "musiclover66",
    },
    album: {
      id: 1,
      title: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      artUrl: "http://dummyimage.com/100x100.png/cc0000/ffffff",
    },
  },
  {
    id: 2,
    content:
      "Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
    stars: 4,
    likes: 15,
    likedByCurrentUser: false,
    user: {
      id: 1,
      userName: "musiclover66",
    },
    album: {
      id: 2,
      title: "Thriller",
      artist: "Michael Jackson",
      artUrl: "http://dummyimage.com/100x100.png/ff4444/ffffff",
    },
  },
  {
    id: 3,
    content: "Nullam molestie nibh in lectus. Pellentesque at nulla.",
    stars: 5,
    likes: 18,
    likedByCurrentUser: true,
    user: {
      id: 1,
      userName: "musiclover66",
    },
    album: {
      id: 3,
      title: "Abbey Road",
      artist: "The Beatles",
      artUrl: "http://dummyimage.com/100x100.png/dddddd/000000",
    },
  },
];

function CatalogPage() {
  const { username } = useParams();
  const [user, setUser] = useState(TEMP_USER);
  const [listenedAlbums, setListenedAlbums] = useState(TEMP_LISTENED_ALBUMS);
  const [wantToListenAlbums, setWantToListenAlbums] = useState(
    TEMP_WANT_TO_LISTEN_ALBUMS
  );
  const [reviews, setReviews] = useState(TEMP_REVIEWS);
  const [activeTab, setActiveTab] = useState("LISTENED");

  const renderTabContent = () => {
    switch (activeTab) {
      case "LISTENED":
        return <CatalogGrid albums={listenedAlbums} />;
      case "WANT_TO_LISTEN":
        return <CatalogGrid albums={wantToListenAlbums} />;
      case "REVIEWS":
        return <CatalogReviewsGrid reviews={reviews} />;
      default:
        return <CatalogGrid albums={listenedAlbums} />;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{user.userName}'s Catalog</h1>
        <FollowButton username={user.userName} />
      </div>

      <CatalogTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}

export default CatalogPage;
