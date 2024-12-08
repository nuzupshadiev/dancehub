"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import VideoItem from "./video-item";

import Project, { ProjectVideosT, ProjectVideoT } from "@/src/API/project";
import Video from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import VideoInput from "@/components/videoInput";
import { useRouter } from "next/navigation";
import { Snippet } from "@nextui-org/react";

function ProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
    onClose: onCreateClose,
  } = useDisclosure();
  const [project, setProject] = React.useState<ProjectVideosT | null>(null);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [videos, setVideos] = React.useState<ProjectVideoT[]>([]);
  const { user } = React.useContext(UserContext);
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoDescription, setVideoDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState<File | null>(null);
  const [code, setCode] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    Project.getProjectVideos(params.id, user)
      .then((project) => {
        setProject(project);
        setVideos(project.videos);
      })
      .catch((err) => {});
    Project.getProjectCode(params.id, user).then((project) => {
      setCode(project.projectCode);
    });
  }, [params.id, user]);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const filteredVideos = React.useMemo(() => {
    return videos.filter((video) =>
      video.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [videos, filterValue]);

  const deleteVideo = React.useCallback((video: ProjectVideoT) => {
    Video.deleteVideo(video.id, user).then(() => {
      setVideos((prev) =>
        prev.filter((videoItem) => videoItem.id !== video.id)
      );
    });
  }, []);

  const onVideoUploadHandler = React.useCallback(() => {
    if (!videoTitle || !videoDescription || !videoUrl) {
      setWarningMessage("Please fill out all fields");
      return;
    }
    // create new video
    // Project.createVideo(
    const formData = new FormData();

    formData.append("videoFile", videoUrl);
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("projectId", params.id);
    Video.createVideo(formData, user)
      .then((video) => {
        setVideos([...videos, video.data]);
        onCreateClose();
      })
      .catch((err) => {
        console.error(err);
        setWarningMessage("An error occurred while creating the video");
      });
  }, [
    videoTitle,
    videoDescription,
    videoUrl,
    project,
    user,
    videos,
    setVideos,
    onCreateClose,
  ]);

  if (!user) {
    return <p>You need to be logged in</p>;
  }
  if (!project) {
    return <p>No project was found with this id</p>;
  }

  return (
    <div className="flex flex-col px-2 py-8 md:px-8">
      {/* Actions bar */}
      <div className="flex flex-row flex-wrap justify-between items-center gap-4 mb-3">
        <div className="flex flex-row justify-center items-center gap-4">
          <Link href="/dashboard/project" color="foreground">
            <h1 className="text-xl font-bold">{project.title}</h1>
          </Link>
          <div>
            <Input
              isClearable
              className="min-w-[300px] sm:max-w-[44%]"
              placeholder={"Search by name..."}
              size="md"
              startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              value={filterValue}
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
          </div>
        </div>
        <div className="flex gap-4">
          {code && (
            <Snippet symbol="" size="md">
              {code}
            </Snippet>
          )}
          <Button
            color="primary"
            size="md"
            startContent={<FontAwesomeIcon icon={faPlus} />}
            variant="solid"
            onPress={onCreateOpen}
          >
            {"Upload a Video"}
          </Button>
        </div>
        <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
          <ModalContent>
            <ModalHeader>{"Upload a Video"} </ModalHeader>
            <ModalBody>
              <VideoInput setVideoSource={setVideoUrl} videoSource={videoUrl} />
              <Input
                isRequired
                label={"Title"}
                type="text"
                value={videoTitle}
                onValueChange={setVideoTitle}
              />
              <Input
                isRequired
                label={"Description"}
                type="text"
                value={videoDescription}
                onValueChange={setVideoDescription}
              />
              {warningMessage && (
                <p className="text-red-500 text-xs text-start w-full">
                  {warningMessage}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCreateOpenChange}>
                {"Cancel"}
              </Button>
              <Button
                color="primary"
                variant="solid"
                onPress={onVideoUploadHandler}
              >
                {"Create"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      {/* <Divider /> */}
      {/* Simulations */}
      <div className="flex flex-col gap-4">
        {filteredVideos.map((video) => (
          <VideoItem key={video.id} video={video} deleteVideo={deleteVideo} />
        ))}
      </div>
    </div>
  );
}
export default ProjectPage;
