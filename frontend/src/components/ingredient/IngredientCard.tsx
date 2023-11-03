import ValueEdit from "@/components/ingredient/ValueEdit"
import { IngredientMeta, Options } from "@/util/recipe"
import { Button, Checkbox, Tooltip } from "@nextui-org/react"
import clsx from "clsx"
import { useState } from "react"
import { FaCircleInfo, FaGear, FaX } from "react-icons/fa6"

export default function IngredientCard({
  name,
  meta,
  options,
  enabled,
  setEnabled,
  onOptionsUpdate,
  onRemove,
}: {
  name: string
  meta: IngredientMeta
  options?: Options
  enabled?: boolean
  setEnabled?: (enabled: boolean) => void
  onOptionsUpdate?: (newOptions: Options) => void
  onRemove?: () => void
}) {
  const [showOptions, setShowOptions] = useState(false)

  const isEnabled = enabled || enabled === undefined

  return (
    <div className="flex flex-col space-y-2 rounded-md border border-neutral-800 bg-neutral-900 p-4 transition-colors duration-300 hover:bg-neutral-950">
      <div className="flex w-full flex-row items-center justify-between space-x-3">
        <div className="flex w-full flex-row items-center space-x-3">
          <div
            className={clsx("text-2xl text-blue-500", {
              "text-neutral-500": !isEnabled,
            })}
          >
            {meta.icon}
          </div>
          <div className="flex w-full flex-col">
            <span className="flex items-center">
              <b
                className={clsx({
                  "text-neutral-600 line-through": !isEnabled,
                })}
              >
                {name}
              </b>
              {enabled !== undefined && (
                <Checkbox
                  color="success"
                  isSelected={enabled}
                  onValueChange={setEnabled}
                  className="ml-1"
                  size="sm"
                />
              )}
            </span>
            <small className="text-neutral-400">{meta.description}</small>
          </div>
        </div>
        <div className="flex w-fit flex-row items-center space-x-3">
          {onRemove && (
            <Button
              isIconOnly
              startContent={<FaX />}
              color="danger"
              size="sm"
              variant="light"
              onClick={onRemove}
            />
          )}
          {options && (
            <Button
              isIconOnly
              startContent={
                <span
                  className={clsx("text-neutral-400", {
                    "animate-spin": showOptions,
                  })}
                >
                  <FaGear />
                </span>
              }
              size="sm"
              variant="light"
              onClick={() => setShowOptions((prev) => !prev)}
            />
          )}
        </div>
      </div>
      {options && showOptions && onOptionsUpdate && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(options).map(([name, value]) => {
            const helpText = meta.param_info[name].description
            const paramStartContent = (
              <code className="flex items-center space-x-1 rounded-l-sm bg-neutral-700 px-2 py-1">
                <span>{name}</span>
                {helpText && <FaCircleInfo />}
              </code>
            )
            return (
              <div
                key={name}
                className="flex w-fit items-center rounded-md border border-neutral-700 text-xs"
              >
                {helpText ? (
                  <Tooltip content={helpText}>{paramStartContent}</Tooltip>
                ) : (
                  paramStartContent
                )}
                <code className="flex items-center space-x-1 px-2">
                  <span>{String(value)}</span>
                  <ValueEdit
                    name={name}
                    value={value}
                    hint={helpText}
                    onSave={(newValue) => {
                      onOptionsUpdate({
                        ...options,
                        [name]: newValue,
                      })
                    }}
                  />
                </code>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
