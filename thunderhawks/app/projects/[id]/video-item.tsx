import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import { VideoT } from "@/src/API/video";
import { useRouter } from "next/navigation";
import Project, { ProjectVideoT } from "@/src/API/project";

interface VideoItemProps {
  video: ProjectVideoT;
  deleteVideo: (id: string) => void;
}
const VideoItem = ({ video, deleteVideo }: VideoItemProps) => {
  const {
    isOpen: isProjectSettingOpen,
    onOpen: onProjectSettingOpen,
    onOpenChange: onProjectSettingOpenChange,
  } = useDisclosure();

  const { id, title, thumbnailUrl, description } = video;

  const router = useRouter();

  return (
    <Card
      className={
        "flex flex-col gap-y-2 border-2 border-transparent hover:border-primary-600 bg-primary-50 dark:bg-darkBg-900 p-4"
      }
      isPressable
      disableRipple
      onPress={() => router.push(`/video/${id}`)}
      as={"div"}
    >
      <CardBody className=" flex flex-row gap-4 !p-0 ml-1 h-20">
        {/* <img
          alt="thumbnail"
          className="object-fit rounded-lg"
          src={thumbnailUrl}
        /> */}
        <div>
          <h1 className="font-bold text-xl text-foreground">{title}</h1>
        </div>
      </CardBody>
    </Card>
  );
};

export default VideoItem;
