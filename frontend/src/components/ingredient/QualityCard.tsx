import { getColorForQuality } from "@/util/quality"
import { Card, CardBody, Slider } from "@nextui-org/react"
import { useState } from "react"
import { FaStar } from "react-icons/fa6"

export default function QualityCard({
  quality,
  updateQuality,
}: {
  quality: number
  updateQuality: (quality: number) => void
}) {
  const [editQuality, setEditQuality] = useState<number>(() => quality)

  return (
    <Card radius="none">
      <CardBody className="flex-row items-center justify-between space-x-2">
        <span className="text-blue-500">
          <FaStar />
        </span>
        <small>Quality:</small>
        <Slider
          step={1}
          minValue={0}
          maxValue={100}
          showTooltip
          color={getColorForQuality(editQuality)}
          value={editQuality}
          onChange={(newQuality) => setEditQuality(newQuality as number)}
          onChangeEnd={(newQuality) => updateQuality(newQuality as number)}
        />
      </CardBody>
    </Card>
  )
}
