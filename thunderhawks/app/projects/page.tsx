"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
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
import { ProjectT } from "@/src/API/project";
import { testProjects } from "@/src/testdata/testdata";
import { ThemeSwitch } from "@/components/theme-switch";
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

  const [projects, setProjects] = React.useState<ProjectT[]>(testProjects);
  const [filterValue, setFilterValue] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [joinCode, setJoinCode] = React.useState("");

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [projects, filterValue]);

  const deleteProject = React.useCallback((id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    // send delete request to server
  }, []);

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
        {filteredProjects.map((project) => (
          <ProjectItem key={project.id} project={project} deleteProject={deleteProject} />
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
            <Button>{"Create"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isJoinOpen} onOpenChange={onJoinOpenChange}>
        <ModalContent>
          <ModalHeader>{"Join Project"}</ModalHeader>
          <ModalBody>
            <Input
              data-gtag-id="project-join-code-input"
              label={"Invitation Code"}
              labelPlacement="outside"
              placeholder={"Invitation Code"}
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
            <Button>{"Join"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
export default Page;
