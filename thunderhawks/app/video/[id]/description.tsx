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
        {isExpanded ? (
          <div className="flex flex-col gap-4">
            <p>{description}</p>
            <button
              className="cursor-pointer bg-transparent border-none text-blue-500"
              onClick={toggleExpand}
            >
              show less
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <p>{previewText}</p>
            <button
              className="cursor-pointer bg-transparent border-none text-blue-500"
              onClick={toggleExpand}
            >
              show more
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
