import { Input } from "@nextui-org/input";

interface TimeInputProps {
  minutes: string;
  seconds: string;
  setMinutes: (value: string) => void;
  setSeconds: (value: string) => void;
}
export default function TimeInput({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
}: TimeInputProps) {
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setMinutes(value.replace(/\D/, ""));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (+value >= 0 && +value <= 59) {
      setSeconds(value.replace(/\D/, ""));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        className="w-10"
        maxLength={2}
        placeholder="m"
        size="sm"
        type="text"
        value={minutes}
        variant="bordered"
        onChange={handleMinutesChange}
      />
      <span>:</span>
      <Input
        className="w-10"
        maxLength={2}
        placeholder="s"
        size="sm"
        type="text"
        value={seconds}
        variant="bordered"
        onChange={handleSecondsChange}
      />
    </div>
  );
}
