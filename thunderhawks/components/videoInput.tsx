import { Button } from "@nextui-org/button";
import React, { useRef, useState } from "react";

interface VideoInputProps {
  videoSource: string;
  setVideoSource: (value: string) => void;
  thumbnailSource: string;
  setThumbnailSource: (value: string) => void;
  width?: string | number;
  height?: string | number;
}

const VideoInput: React.FC<VideoInputProps> = ({
  width = "100%",
  height,
  videoSource,
  setVideoSource,
  thumbnailSource,
  setThumbnailSource,
}) => {
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);

      setVideoSource(url);
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);

      setThumbnailSource(url);
    }
  };

  const handleChooseVideo = () => {
    videoInputRef.current?.click();
  };

  const handleChooseThumbnail = () => {
    thumbnailInputRef.current?.click();
  };

  return (
    <div className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 space-y-4">
      {/* Video Input */}
      <input
        ref={videoInputRef}
        accept=".mov,.mp4"
        className="hidden"
        type="file"
        onChange={handleVideoChange}
      />
      {!videoSource && (
        <Button color="primary" onPress={handleChooseVideo}>
          Choose a video to upload
        </Button>
      )}
      {videoSource && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          controls
          className="block m-0"
          height={height}
          src={videoSource}
          width={width}
        />
      )}

      {/* Thumbnail Input */}
      <input
        ref={thumbnailInputRef}
        accept=".jpg,.jpeg,.png"
        className="hidden"
        type="file"
        onChange={handleThumbnailChange}
      />
      {!thumbnailSource && (
        <Button
          className="text-white"
          color="success"
          onPress={handleChooseThumbnail}
        >
          Choose a thumbnail image
        </Button>
      )}
      {thumbnailSource && (
        <img
          alt="Thumbnail preview"
          className="w-32 h-32 object-cover rounded-md"
          src={thumbnailSource}
        />
      )}

      {/* Footer */}
      <div className="bg-default-300 w-full min-h-[40px] leading-[40px] text-center rounded-lg">
        {videoSource || thumbnailSource ? "Good to go" : "Nothing selected"}
      </div>
    </div>
  );
};

export default VideoInput;
