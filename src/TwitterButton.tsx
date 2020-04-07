import React from "react";

export const TwitterButton = () => {
  return (
    <div>
      <a
        style={{ display: "none" }}
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className=" twitter-share-button"
        data-show-count="false"
      >
        Tweet
      </a>
    </div>
  );
};
