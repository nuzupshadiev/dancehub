"use client";

import React from "react";

import { ProjectT } from "@/src/API/project";
import { testProjects } from "@/src/testdata/testdata";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { VideoT } from "@/src/API/video";
import VideoItem from "./video-item";

function Project({
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
  const [project, setProject] = React.useState<ProjectT | null>(null);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");

  React.useEffect(() => {
    setProject(
      testProjects.find((project) => project.id === params.id) || null
    );
  }, [params.id]);

  const videos = React.useMemo(() => {
    return project?.videos || [];
  }, [project]);

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

  const deleteVideo = React.useCallback((id: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        videos: prev.videos.filter((video) => video.id !== id),
      };
    });
    // send delete request to server
  }, []);

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
            <ModalHeader>{"Create a Video"} </ModalHeader>
            <ModalBody>Video upload</ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCreateOpenChange}>
                {"Cancel"}
              </Button>
              <Button
                color="primary"
                variant="solid"
                onPress={onCreateOpenChange}
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
export default Project;
