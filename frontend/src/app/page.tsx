"use client"

import IngredientCard from "@/components/ingredient/IngredientCard"
import QualityCard from "@/components/ingredient/QualityCard"
import RecipeCard from "@/components/recipe/RecipeCard"
import { useSearch } from "@/context/SearchContext"
import { Recipe, ingredientMeta, recipes } from "@/util/recipe"
import { Button, Card, CardBody, Chip, Link } from "@nextui-org/react"
import clsx from "clsx"
import { useState } from "react"
import { FaStar, FaUtensils } from "react-icons/fa6"

function deepCopy(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(
    deepCopy(recipes[0]),
  )

  const { search, setSearch } = useSearch()
  const filteredRecipes = recipes.filter((recipe) => {
    return (
      !search || recipe.name.toLowerCase().includes(search.toLocaleLowerCase())
    )
  })

  return (
    <main className="flex min-h-screen w-full flex-col justify-between gap-4 p-24 md:flex-row">
      <div className="flex flex-grow flex-col">
        <h1 className="mb-2 space-x-2 text-lg font-bold text-white">
          <span>Recipes</span>
          <Chip variant="faded">{filteredRecipes.length}</Chip>
        </h1>
        <div className="mb-32 grid gap-2 lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={recipe.name}
              isSelected={recipe.name === selectedRecipe.name}
              onSelect={() => setSelectedRecipe(deepCopy(recipe))}
            />
          ))}
          <Card
            classNames={{
              base: clsx(
                "bg-transparent border border-neutral-700 border-dashed",
              ),
            }}
          >
            <CardBody className="items-center justify-center">
              <div className="flex flex-row items-center space-x-1 uppercase text-neutral-400">
                <FaStar />
                <h3 className="text-sm font-semibold">New Idea?</h3>
              </div>
              <Link showAnchorIcon href="https://github.com/darmiel/more-jpeg">
                Contribute
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex w-full flex-col md:w-96">
        <h1 className="mb-2 w-fit text-lg font-bold">Ingredients</h1>
        <section className="w-full space-y-2">
          <QualityCard
            quality={selectedRecipe.quality}
            updateQuality={(quality) => {
              setSelectedRecipe((prev) => {
                return {
                  ...prev,
                  quality: Math.max(0, Math.min(100, quality)),
                }
              })
            }}
          />
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <IngredientCard
              key={index}
              meta={ingredientMeta[ingredient.id]}
              name={ingredient.id}
              enabled={!ingredient.disabled}
              setEnabled={() => {
                ingredient.disabled = !ingredient.disabled
                setSelectedRecipe(deepCopy(selectedRecipe))
              }}
              onOptionsUpdate={(options) => {
                ingredient.with = options
                setSelectedRecipe(deepCopy(selectedRecipe))
              }}
              options={ingredient.with}
            />
          ))}
          <Button fullWidth color="primary" startContent={<FaUtensils />}>
            Bake!
          </Button>
        </section>
      </div>
    </main>
  )
}
