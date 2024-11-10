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
import Project, { ProjectT } from "@/src/API/project";
import { useRouter } from "next/navigation";

interface ProjectItemProps {
  project: Project;
  deleteProject: (project: Project) => void;
}
const ProjectItem = ({ project, deleteProject }: ProjectItemProps) => {
  const {
    isOpen: isProjectSettingOpen,
    onOpen: onProjectSettingOpen,
    onOpenChange: onProjectSettingOpenChange,
  } = useDisclosure();
  const { id, title, administrator, members, videos } = project.data;
  const router = useRouter();

  const copyInvitationCode = React.useCallback(() => {
    navigator.clipboard.writeText(id);
  }, [id]);

  return (
    <Card
      className={
        "flex flex-col gap-y-2 border-2 border-transparent hover:border-primary-600 bg-primary-50 dark:bg-darkBg-900 p-4"
      }
      isPressable
      disableRipple
      onPress={() => router.push(`/projects/${id}`)}
      as={"div"}
    >
      <CardHeader className="!p-0 flex flex-row flex-wrap justify-between items-center gap-y-1">
        <Chip className="bg-background rounded-xl text-xs">
          <p>{"date"}</p>
        </Chip>
        <div className="flex flex-row gap-x-2">
          <Tooltip content="Copy Invitation Code" placement="top">
            <div>
              <Button
                isIconOnly
                className="bg-background"
                radius="full"
                size="sm"
                onPress={copyInvitationCode}
              >
                <FontAwesomeIcon
                  className="text-default-600 size-3"
                  icon={faCopy}
                />
              </Button>
            </div>
          </Tooltip>
          <Tooltip content="Delete Project" placement="top">
            <div>
              <Button
                isIconOnly
                className="bg-background"
                radius="full"
                size="sm"
                onPress={() => deleteProject(project)}
              >
                <FontAwesomeIcon
                  className="text-default-600 size-3"
                  icon={faTrash}
                />
              </Button>
            </div>
          </Tooltip>
        </div>
      </CardHeader>
      <CardBody className="!p-0 ml-1 h-20">
        <h1 className="font-bold text-xl text-foreground">{title}</h1>
        <p className="text-xs">time</p>
      </CardBody>
      <CardFooter className="!p-0 flex flex-row justify-end py-2 items-center gap-x-4">
        <FontAwesomeIcon icon={faUsers} className="text-default-500" />
      </CardFooter>
    </Card>
  );
};

export default ProjectItem;
