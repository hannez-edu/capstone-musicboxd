function formatAlbumDate(dateStr = "1970-01-01") {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = (1 + date.getDay()).toString().padStart(2, "0");
    
    return `${month}/${day}/${year}`;
}

export default formatAlbumDate;
