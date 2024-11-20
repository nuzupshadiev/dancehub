"use client";

import React from "react";
import ReactPlayer from "react-player";

function Page() {
  const playerRef = React.useRef(null);

  const goToTime = React.useCallback((time: string) => {
    if (playerRef.current) {
      playerRef.current.seekTo(105, "seconds");
    }
  }, []);

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={"https://www.youtube.com/watch?v=JOpsOnFC_rU"}
        width={"100%"}
        height={"100%"}
        controls
      />
      <button onClick={() => goToTime("102")}>105</button>
      <h1>Test Page</h1>
    </div>
  );
}
export default Page;
