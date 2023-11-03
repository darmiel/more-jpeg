import IngredientCard from "@/components/ingredient/IngredientCard"
import { IngredientMeta, ingredientMeta } from "@/util/recipe"
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from "@nextui-org/react"
import { useState } from "react"
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6"

export default function PopoverAddIngredient({
  onAdd,
}: {
  onAdd: (ingredient_name: string, ingredient_meta: IngredientMeta) => void
}) {
  const [search, setSearch] = useState("")

  return (
    <Popover placement="left" showArrow={true}>
      <PopoverTrigger>
        <Button fullWidth variant="bordered" startContent={<FaPlus />}>
          Add Ingredient
        </Button>
      </PopoverTrigger>
      <PopoverContent className="py-4">
        <Input
          startContent={<FaMagnifyingGlass />}
          size="sm"
          placeholder="Search Ingredient..."
          value={search}
          onValueChange={setSearch}
          type="search"
        />

        <ScrollShadow className="mt-4 flex max-h-80 flex-col space-y-2">
          {Object.entries(ingredientMeta)
            .filter(
              ([name]) =>
                !search || name.toLowerCase().includes(search.toLowerCase()),
            )
            .map(([name, meta]) => (
              <button
                key={name}
                className="w-full text-left"
                onClick={() => {
                  onAdd(name, meta)
                  setSearch("")
                }}
              >
                <IngredientCard meta={meta} name={name} />
              </button>
            ))}
        </ScrollShadow>
      </PopoverContent>
    </Popover>
  )
}
