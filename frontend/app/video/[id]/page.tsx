"use client";
import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Selection,
  useDisclosure,
} from "@nextui-org/react";
import { OnProgressProps } from "react-player/base";

import CommentsSection from "./comments";
import DescriptionSection from "./description";

import * as VideoAPI from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import { UserT } from "@/src/API/user";
import VideoInput from "@/components/videoInput";
import Project from "@/src/API/project";
function VideoPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = React.useContext(UserContext);
  const [video, setVideo] = React.useState<VideoAPI.default | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);
  const [projectId, setProjectId] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState<File | null>(null);
  const [selectedUsers, setSelectedUsers] = React.useState<Selection>(
    new Set([])
  );
  const [selectedVersions, setSelectedVersions] = React.useState<Selection>(
    new Set([video?.data.version as string])
  );
  const [usersInTheProject, setUsersInTheProject] = React.useState<UserT[]>([]);
  const playerRef = useRef(null);

  const videoVersions = React.useMemo(() => {
    return video?.data.versions.map((version) => version) || [];
  }, [video?.data.versions]);

  React.useEffect(() => {
    setVideoUrl(null);
  }, [onOpenChange]);

  React.useEffect(() => {
    if (!user) {
      return;
    }
    VideoAPI.default
      .getVideo(params.id, user)
      .then((video) => {
        setVideo(video);
        setLikes(video.data.likes);
        video.data.likedBy.forEach((likedBy) => {
          if (Number(likedBy.id) === user?.data.id) {
            setIsLiked(true);
          }
        });
        Project.getProject(user, video.data.project).then((project) => {
          setUsersInTheProject(project.data.members);
        });
      })
      .catch((err) => {
        setVideo(null);
      });
  }, [params.id, user]);

  const handleLike = React.useCallback(() => {
    if (!user || !video) {
      return;
    }
    if (isLiked) {
      VideoAPI.default
        .unlikeVideo(user, video?.data.id)
        .then(() => {
          setIsLiked(false);
          setLikes((prev) => prev - 1);
        })
        .catch(() => {});
    } else {
      VideoAPI.default
        .likeVideo(user, video?.data.id)
        .then(() => {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
        })
        .catch(() => {});
    }
  }, [user, video, isLiked]);

  const goToTime = React.useCallback((time: string) => {
    const [minutes, seconds] = time.split(":").map(Number);
    const goToTimeSeconds = minutes * 60 + seconds;

    if (playerRef.current) {
      // @ts-ignore
      playerRef.current.seekTo(goToTimeSeconds, "seconds");
    }
  }, []);

  const handleSelectVersion = React.useCallback((selected: Selection) => {
    setSelectedVersions(selected);
    if (selected === "all" || selected.size === 0) return;
    // VideoAPI.default
    //   .getVideoVersion(params.id, user, selected.values().next().value)
    //   .then((video) => {
    //     setVideo(video);
    //   });
  }, []);
  const handleOnProgress = React.useCallback((state: OnProgressProps) => {
    setSecondsElapsed(state.playedSeconds);
  }, []);

  const onVideoUploadHandler = React.useCallback(() => {
    // create new video
  }, []);

  if (!user) {
    return <p>You need to be logged in to view this page</p>;
    // router.push("/login");
  }
  if (!video) {
    return <p>No video was found with this id</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <ReactPlayer
          ref={playerRef}
          controls
          height={"100%"}
          url={video.data.videoUrl}
          width={"100%"}
          onProgress={handleOnProgress}
        />
        <div className="flex flex-row justify-between max-w-7xl">
          <h1 className="text-xl font-bold">{video.data.title}</h1>
          <div className="flex flex-row gap-2 items-center">
            <Button size="sm" onClick={onOpen}>
              Upload new version
            </Button>
            <Select
              className="w-40"
              placeholder="Select version"
              selectedKeys={selectedVersions}
              size="sm"
              variant="bordered"
              onSelectionChange={handleSelectVersion}
            >
              {videoVersions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-40"
              placeholder="Filter comments"
              selectedKeys={selectedUsers}
              size="sm"
              variant="bordered"
              onSelectionChange={setSelectedUsers}
            >
              {usersInTheProject.map((user) => (
                <SelectItem key={user.name} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </Select>
            <div
              className="flex flex-row gap-2 items-center cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={handleLike}
            >
              {isLiked ? (
                <FontAwesomeIcon color="red" icon={faHeartSolid} />
              ) : (
                <FontAwesomeIcon icon={faHeart} />
              )}
              <p>{likes}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-7xl">
        <DescriptionSection video={video} />
        <CommentsSection
          goToTime={goToTime}
          projectId={projectId}
          secondsElapsed={secondsElapsed}
          selectedUsers={selectedUsers}
          video={video}
          usersInTheProject={usersInTheProject}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{"Upload a new version of the video"} </ModalHeader>
              <ModalBody>
                <VideoInput
                  setVideoSource={setVideoUrl}
                  videoSource={videoUrl}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onOpenChange}>
                  {"Cancel"}
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={onVideoUploadHandler}
                >
                  {"Upload"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
export default VideoPage;
