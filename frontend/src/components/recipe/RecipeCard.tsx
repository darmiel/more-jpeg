import { getColorForQuality } from "@/util/quality"
import { Recipe } from "@/util/recipe"
import { Card, CardFooter, Image, Progress, Tooltip } from "@nextui-org/react"
import clsx from "clsx"

export default function RecipeCard({
  recipe,
  isSelected = false,
  onSelect,
}: {
  recipe: Recipe
  isSelected?: boolean
  onSelect?: (recipe: Recipe) => void
}) {
  const destroyFactorColor = getColorForQuality(100 - recipe.destroy_factor)
  return (
    <Card
      isPressable
      classNames={{
        base: clsx({
          "bg-transparent border border-blue-500": isSelected,
        }),
      }}
      onPress={() => onSelect?.(recipe)}
    >
      <Image
        removeWrapper
        className="z-0 h-full w-full object-cover"
        src={recipe.preview}
        alt="Preview"
      />
      <CardFooter className="mb-2 flex-col items-start gap-2 p-4 text-small">
        <div className="flex w-full items-center justify-between gap-2">
          <b
            className={clsx("whitespace-nowrap", {
              "text-blue-500": isSelected,
            })}
          >
            {recipe.name}
          </b>
          <Tooltip
            content={`Destruction Indicator: ${recipe.destroy_factor} / 100`}
            color={destroyFactorColor}
          >
            <Progress
              value={recipe.destroy_factor}
              size="sm"
              color={destroyFactorColor}
            />
          </Tooltip>
        </div>
        <small>{recipe.description}</small>
      </CardFooter>
    </Card>
  )
}
