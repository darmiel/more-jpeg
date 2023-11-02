import { Button, Card, CardBody, Input } from "@nextui-org/react"
import { useState } from "react"
import { FaCheck, FaPen, FaStar } from "react-icons/fa6"

export default function QualityCard({
  quality,
  updateQuality,
}: {
  quality: number
  updateQuality: (quality: number) => void
}) {
  const [editQuality, setEditQuality] = useState<number>(-1)
  const isEditQuality = editQuality >= 0

  return (
    <Card
      classNames={{
        base: "bg-blue-500 bg-opacity-25 border border-blue-500 w-full",
      }}
    >
      <CardBody className="flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <span className="text-blue-500">
            <FaStar />
          </span>
          <strong>Quality:</strong>
          {isEditQuality ? (
            <Input
              type="number"
              defaultValue={String(editQuality)}
              onValueChange={(value) => setEditQuality(Number(value))}
              variant="bordered"
            />
          ) : (
            <code className="w-fit text-blue-500">{quality}</code>
          )}
          <span>/</span>
          <code className="w-fit">100</code>
        </div>
        {isEditQuality ? (
          <Button
            isIconOnly
            startContent={<FaCheck className="text-green-500" />}
            variant="light"
            size="sm"
            onClick={() => {
              updateQuality(editQuality)
              setEditQuality(-1)
            }}
          />
        ) : (
          <Button
            isIconOnly
            startContent={<FaPen className="text-blue-500" />}
            variant="light"
            size="sm"
            onClick={() => setEditQuality(quality)}
          />
        )}
      </CardBody>
    </Card>
  )
}
