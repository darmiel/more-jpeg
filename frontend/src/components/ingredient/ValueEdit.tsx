import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react"
import { useState } from "react"
import { FaPen } from "react-icons/fa6"

export default function ValueEdit({
  name,
  value,
  hint,
  onSave,
}: {
  name: string
  value: unknown
  hint?: string
  onSave?: (newValue: unknown) => void
}) {
  const [newValue, setNewValue] = useState<unknown>(() => value)

  return (
    <Popover
      placement="bottom"
      showArrow={true}
      classNames={{
        base: "border border-neutral-700",
      }}
    >
      <PopoverTrigger>
        <span className="text-neutral-600 hover:cursor-pointer">
          <FaPen />
        </span>
      </PopoverTrigger>
      <PopoverContent className="space-y-2 p-4">
        <h2 className="text-md space-x-2 font-semibold">
          <span>Editing</span>
          <span className="bg-neutral-700 px-2 py-1">{name}</span>
        </h2>
        {hint && <code className="text-sm">{hint}</code>}
        <div className="flex w-full items-center space-x-2">
          {typeof value === "boolean" ? (
            <Checkbox
              size="sm"
              onValueChange={setNewValue}
              isSelected={newValue as boolean}
            />
          ) : typeof value === "number" ? (
            <Input
              type="number"
              size="sm"
              placeholder={String(value)}
              value={newValue as string}
              onValueChange={setNewValue}
            />
          ) : typeof value === "string" ? (
            <Input
              type="text"
              size="sm"
              placeholder={String(value)}
              onValueChange={setNewValue}
              value={newValue as string}
            />
          ) : (
            <>Unknown Type</>
          )}
          <Button size="sm" color="primary" onClick={() => onSave?.(newValue)}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
