import { Card, CardBody, CardHeader, User } from "@nextui-org/react";
import { useState } from "react";

import Video, { VideoT } from "@/src/API/video";

interface DescriptionSectionProps {
  video: Video;
}

export default function DescriptionSection({ video }: DescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const description = video.data.description;
  const previewText = description.slice(0, 150) + "...";

  return (
    <Card shadow="none" className="bg-default-200">
      <CardHeader>
        <User
          avatarProps={{
            src: video.data.uploader.profileUrl,
          }}
          description={video.data.uploader.name}
          name={video.data.uploader.name}
        />
      </CardHeader>
      <CardBody className="flex flex-row">
        <p>
          {isExpanded ? (
            <div className="flex flex-col gap-4">
              {description}
              <p className="cursor-pointer" onClick={toggleExpand}>
                show less
              </p>
            </div>
          ) : (
            <div className="flex flex-row gap-2">
              {previewText}{" "}
              <p className="cursor-pointer" onClick={toggleExpand}>
                show more
              </p>
            </div>
          )}
        </p>
      </CardBody>
    </Card>
  );
}
