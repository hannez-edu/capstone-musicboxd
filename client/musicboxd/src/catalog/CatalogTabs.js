function CatalogTabs({ activeTab, onTabChange }) {
  return (
    <div className="btn-group">
      <button
        type="button"
        className={`btn ${
          activeTab === "LISTENED" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onTabChange("LISTENED")}
      >
        Listened
      </button>
      <button
        type="button"
        className={`btn ${
          activeTab === "WANT_TO_LISTEN" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onTabChange("WANT_TO_LISTEN")}
      >
        Listen List
      </button>
      <button
        type="button"
        className={`btn ${
          activeTab === "REVIEWS" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onTabChange("REVIEWS")}
      >
        Reviews
      </button>
    </div>
  );
}

export default CatalogTabs;
