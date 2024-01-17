import axios from "axios";

export function formatPostedDate(postedDate) {
  const currentDate = new Date();
  const postDate = new Date(postedDate);
  const timeDifference = currentDate - postDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return "Posted today";
  } else if (daysDifference === 1) {
    return "Posted yesterday";
  } else {
    return `Posted ${daysDifference} days ago`;
  }
}
