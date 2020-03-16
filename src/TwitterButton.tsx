import React, { useEffect, useState } from "react";
import { Twitter } from "react-social-sharing";

export const TwitterButton = () => {
  const [url, setUrl] = useState(window["location"].href);

  useEffect(() => {
    setUrl(window["location"].href);
  }, [window["location"].href]);

  return (
    <div style={{ marginLeft: 10, display: "inline-block" }}>
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
