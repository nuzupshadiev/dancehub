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
import { UserContext } from "@/utils/user-context";

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
  const { user } = React.useContext(UserContext);
  const isAdmin = Number(administrator.id) === user?.data.id;
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
      <CardBody className="!p-0 ml-1 h-20">
        <h1 className="font-bold text-xl text-foreground">{title}</h1>
      </CardBody>
      <CardFooter className="!p-0 flex flex-row justify-end py-2 items-center gap-x-4">
        {isAdmin ? (
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
        ) : (
          <div>
            <Button className="bg-transparent" size="sm"></Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectItem;
