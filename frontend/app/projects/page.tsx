"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faFolderPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import ProjectItem from "./project-item";
import Project, { ProjectT } from "@/src/API/project";
import { UserContext } from "@/utils/user-context";
import { useRouter } from "next/navigation";
function Page() {
  const {
    isOpen: isJoinOpen,
    onOpen: onJoinOpen,
    onOpenChange: onJoinOpenChange,
    onClose: onJoinClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
    onClose: onCreateClose,
  } = useDisclosure();
  const [warningMessage, setWarningMessage] = React.useState("");
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [joinCode, setJoinCode] = React.useState("");
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    // fetch projects from server
    Project.getProjects(user)
      .then((projects) => {
        setProjects(projects);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user]);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) =>
      project.data.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [projects, filterValue]);

  const deleteProject = React.useCallback(
    (project: Project) => {
      project
        .delete(user)
        .then(() => {
          setProjects((prev) =>
            prev.filter(
              (projectItem) => projectItem.data.id !== project.data.id
            )
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [user, setProjects]
  );

  const handleJoinProject = React.useCallback(() => {
    Project.joinProject(joinCode, user)
      .then((project) => {
        setProjects((prev) => [...prev, project]);
        onJoinClose();
      })
      .catch((err) => {
        setWarningMessage("Invalid join code");
        console.error(err);
      });
  }, [joinCode, user]);

  const handleCreateProject = React.useCallback(() => {
    if (projectName === "") {
      setWarningMessage("Please enter a project name");
      return;
    }
    Project.createProject(projectName, user)
      .then((project) => {
        setProjects((prev) => [...prev, project]);
        onCreateClose();
      })
      .catch((err) => {
        setWarningMessage("Something went wrong, please try again later");
        console.error(err);
      });
  }, [projectName]);

  if (!user) {
    <p>{"You need to be logged in"}</p>;
  }

  return (
    <div className="flex flex-col px-2 py-8 md:px-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center mb-4">
          <h1 className="text-2xl font-bold">{"Projects"}</h1>
          <Input
            isClearable
            className="min-w-[300px] sm:max-w-[44%]"
            classNames={{
              inputWrapper: "dark:bg-darkBg-900",
            }}
            placeholder={"Search by name..."}
            size="md"
            startContent={<FontAwesomeIcon icon={faSearch} />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex flex-row gap-x-4">
          <Button
            color="primary"
            size="md"
            startContent={<FontAwesomeIcon icon={faFolderPlus} />}
            variant="solid"
            onPress={onCreateOpen}
          >
            {"Create Project"}
          </Button>
          <Button
            color="primary"
            size="md"
            startContent={<FontAwesomeIcon icon={faFolderClosed} />}
            variant="solid"
            onPress={onJoinOpen}
          >
            {"Join Project"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {projects.length === 0 && (
          <div className="flex flex-col justify-center items-center h-60">
            <FontAwesomeIcon
              icon={faFolderClosed}
              className="text-9xl text-default-200"
            />
            <p className="text-default-200 text-lg">{"No projects found"}</p>
          </div>
        )}
        {filteredProjects.map((project) => (
          <ProjectItem
            key={project.data.id}
            project={project}
            deleteProject={deleteProject}
          />
        ))}
      </div>
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <ModalContent>
          <ModalHeader>{"New Project"}</ModalHeader>
          <ModalBody>
            <Input
              classNames={{
                inputWrapper: "dark:bg-darkBg-900",
              }}
              data-gtag-id="project-create-name-input"
              label={"Project Name"}
              labelPlacement="outside"
              placeholder={"Project Name"}
              value={projectName}
              onValueChange={setProjectName}
            />
            {warningMessage && (
              <div className="text-danger text-sm">{warningMessage}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateClose}>
              {"Cancel"}
            </Button>
            <Button onPress={handleCreateProject}>{"Create"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isJoinOpen} onOpenChange={onJoinOpenChange}>
        <ModalContent>
          <ModalHeader>{"Join Project"}</ModalHeader>
          <ModalBody>
            <Input
              data-gtag-id="project-join-code-input"
              label={"Join Code"}
              labelPlacement="outside"
              placeholder={"Join Code"}
              value={joinCode}
              onValueChange={setJoinCode}
            />
            {warningMessage && (
              <div className="text-danger text-sm">{warningMessage}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onJoinClose}>
              {"Cancel"}
            </Button>
            <Button onClick={handleJoinProject}>{"Join"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
export default Page;
