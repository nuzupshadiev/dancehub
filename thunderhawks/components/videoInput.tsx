import { Button } from "@nextui-org/button";
import React, { useRef, useState } from "react";

interface VideoInputProps {
  videoSource: File | null; // Change to accept null initially
  setVideoSource: (value: File) => void; // Function to set the video file
  width?: string | number;
  height?: string | number;
}

const VideoInput: React.FC<VideoInputProps> = ({
  width = "100%",
  height,
  videoSource,
  setVideoSource,
}) => {
  const videoInputRef = useRef<HTMLInputElement | null>(null); // Reference for video file input

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setVideoSource(file); // Pass the video file to the parent component
    }
  };

  const handleChooseVideo = () => {
    videoInputRef.current?.click(); // Trigger hidden file input
  };

  return (
    <div className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 space-y-4">
      {/* Hidden Video Input */}
      <input
        ref={videoInputRef}
        accept=".mov,.mp4"
        className="hidden"
        type="file"
        onChange={handleVideoChange}
      />

      {/* Button to Choose Video */}
      {!videoSource && (
        <Button color="primary" onPress={handleChooseVideo}>
          Choose a video to upload
        </Button>
      )}

      {/* Video Preview */}
      {videoSource && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          controls
          className="block m-0"
          height={height}
          src={URL.createObjectURL(videoSource)}
          width={width}
        />
      )}

      {/* Footer with Selection Status */}
      <div className="bg-default-300 w-full min-h-[40px] leading-[40px] text-center rounded-lg">
        {videoSource ? "Good to go" : "Nothing selected"}
      </div>
    </div>
  );
};

export default VideoInput;
