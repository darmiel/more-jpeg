import { IngredientMeta } from "@/util/recipe"
import { Checkbox } from "@nextui-org/react"
import clsx from "clsx"

export default function IngredientCard({
  name,
  meta,
  enabled,
  setEnabled,
}: {
  name: string
  meta: IngredientMeta
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}) {
  return (
    <div className="flex flex-row items-center space-x-3 rounded-md border border-neutral-800 bg-neutral-900 p-4">
      <div
        className={clsx("flex items-center space-x-1 text-2xl text-blue-500", {
          "text-neutral-500": !enabled,
        })}
      >
        {meta.icon}
      </div>
      <div className="flex flex-col">
        <span className="flex items-center space-x-1">
          <b className={clsx({ "text-neutral-600 line-through": !enabled })}>
            {name}
          </b>
          <Checkbox
            color="success"
            isSelected={enabled}
            onValueChange={setEnabled}
          />
        </span>
        <small className="text-neutral-400">{meta.description}</small>
      </div>
    </div>
  )
}
