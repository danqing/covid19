import React, { useEffect, useState } from "react";

export const TwitterButton = () => {
  const setUrl = useState(window["location"].href)[1];

  useEffect(() => {
    setUrl(window["location"].href);
  }, [window["location"].href]);

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
