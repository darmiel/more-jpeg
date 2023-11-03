"use client"

import IngredientCard from "@/components/ingredient/IngredientCard"
import QualityCard from "@/components/ingredient/QualityCard"
import ModalExport from "@/components/modals/ModalExport"
import ModalImport from "@/components/modals/ModalImport"
import RecipeCard from "@/components/recipe/RecipeCard"
import Warning from "@/components/ui/Warning"
import { useSearch } from "@/context/SearchContext"
import { Recipe, ingredientMeta, recipes } from "@/util/recipe"
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Link,
  Modal,
  ModalContent,
  Tooltip,
} from "@nextui-org/react"
import clsx from "clsx"
import { useRef, useState } from "react"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider"
import {
  FaDownload,
  FaExpand,
  FaFileExport,
  FaFileImport,
  FaRecycle,
  FaStar,
  FaUtensils,
} from "react-icons/fa6"

function deepCopy(obj: unknown) {
  return JSON.parse(JSON.stringify(obj))
}

function downloadBlob(blobURL: string, name: string) {
  const link = document.createElement("a")
  link.href = blobURL
  link.download = name
  document.body.appendChild(link)
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  )
  document.body.removeChild(link)
}

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(
    deepCopy(recipes[0]),
  )

  // Import / Export
  const [modalImportOpen, setModalImportOpen] = useState(false)
  const [modalExportOpen, setModalExportOpen] = useState(false)

  // Watermark
  const [enableWatermark, setEnableWatermark] = useState(true)
  const [enableRandomWatermarkPosition, setEnableRandomWatermarkPosition] =
    useState(true)

  // Bake
  const [sourcePreview, setSourcePreview] = useState("")
  const [bakedPreview, setBakedPreview] = useState("")
  const [modalPreview, setModalPreview] = useState("")
  const [bakedError, setBakedError] = useState("")
  const [isBaking, setIsBaking] = useState(false)

  const { search, setSearch } = useSearch()
  const filteredRecipes = recipes.filter((recipe) => {
    return (
      !search || recipe.name.toLowerCase().includes(search.toLocaleLowerCase())
    )
  })

  const [files, setFiles] = useState<FileList | null>()
  const hasFile = files && files.length > 0
  const fileRef = useRef<HTMLInputElement>(null)

  async function bake() {
    if (!hasFile) {
      return
    }
    // remove ingredients that are disabled
    const ingredients = selectedRecipe.ingredients.filter(
      (ingredient) => !ingredient.disabled,
    )
    // send request to backend
    const data = new FormData()
    data.append("watermark", "on")
    data.append("quality", selectedRecipe.quality.toString())
    data.append("ingredients", JSON.stringify(ingredients))
    data.append("file", files![0])

    setIsBaking(true)
    const resp = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: data,
    })
    setIsBaking(false)
    setBakedPreview("")

    if (!resp.ok) {
      setBakedError(await resp.text())
      return
    }

    setBakedPreview(URL.createObjectURL(await resp.blob()))

    console.log(resp)
  }

  return (
    <main className="flex min-h-screen w-full flex-col gap-8 p-24">
      {/* File Selection */}
      <section className="space-y-2">
        {bakedError ? (
          <Warning warning={bakedError} />
        ) : bakedPreview ? (
          <>
            <div className="flex justify-between space-x-2">
              <Button
                startContent={<FaDownload />}
                size="sm"
                variant="bordered"
                onClick={() => {
                  let downloadName =
                    (files &&
                      `baked-${selectedRecipe.name}-${files[0].name}`) ||
                    "baked.jpeg"
                  if (!downloadName.endsWith(".jpeg")) {
                    downloadName += ".jpeg"
                  }
                  downloadBlob(bakedPreview, downloadName)
                }}
              >
                Save
              </Button>
              <Modal
                size="5xl"
                isOpen={!!modalPreview}
                onClose={() => setModalPreview("")}
              >
                <ModalContent>
                  <img alt="full-preview" src={modalPreview} />
                </ModalContent>
              </Modal>
              <Button
                startContent={<FaExpand />}
                size="sm"
                variant="bordered"
                onClick={() => {
                  setModalPreview(bakedPreview)
                }}
              >
                Full Preview
              </Button>
              <Button
                startContent={<FaRecycle />}
                size="sm"
                variant="bordered"
                onClick={() => {
                  setFiles(null)
                  setSourcePreview("")
                  setBakedPreview("")
                }}
                color="danger"
              >
                Start Over
              </Button>
            </div>
            <ReactCompareSlider
              className="max-h-96 items-center justify-center overflow-hidden rounded-lg"
              itemOne={
                <ReactCompareSliderImage src={sourcePreview} alt="Image one" />
              }
              itemTwo={
                <ReactCompareSliderImage src={bakedPreview} alt="Image two" />
              }
            />
          </>
        ) : files ? (
          <div className="relative flex max-h-72 items-center justify-center overflow-hidden rounded-lg">
            <img src={sourcePreview} />
            <div className="absolute left-4 top-4 rounded-md border border-neutral-600 bg-neutral-800 px-2 py-1">
              {files[0].name}
              <Button
                isIconOnly
                startContent={<FaRecycle />}
                size="sm"
                variant="light"
                onClick={() => {
                  setFiles(null)
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/jpeg,image/png"
              ref={fileRef}
              onChange={(event) => {
                setFiles(event.currentTarget.files)
                if (event.currentTarget.files) {
                  setSourcePreview(
                    URL.createObjectURL(event.currentTarget.files[0]),
                  )
                } else {
                  setSourcePreview("")
                }
              }}
              hidden
            />
            <Button onClick={() => fileRef?.current?.click()}>
              Select File
            </Button>
          </>
        )}
      </section>

      {/* Recipes */}
      <section className="flex flex-col md:flex-row">
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
                <Link
                  showAnchorIcon
                  href="https://github.com/darmiel/more-jpeg"
                >
                  Contribute
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="flex w-full flex-col md:w-96">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-bold">Ingredients</h1>
            <div className="flex space-x-1">
              <Tooltip content="Import">
                <Button
                  isIconOnly
                  startContent={<FaFileImport />}
                  size="sm"
                  variant="light"
                  onClick={() => setModalImportOpen(true)}
                />
              </Tooltip>
              <Modal isOpen={modalImportOpen} onOpenChange={setModalImportOpen}>
                <ModalImport
                  onImport={(newRecipe) => {
                    setSelectedRecipe(deepCopy(newRecipe))
                  }}
                />
              </Modal>

              <Tooltip content="Export">
                <Button
                  isIconOnly
                  startContent={<FaFileExport />}
                  size="sm"
                  variant="light"
                  onClick={() => setModalExportOpen(true)}
                />
              </Tooltip>
              <Modal isOpen={modalExportOpen} onOpenChange={setModalExportOpen}>
                <ModalExport recipe={selectedRecipe} />
              </Modal>
            </div>
          </div>
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

            <div className="rounded-lg border border-dashed border-neutral-600 p-2">
              <Button
                fullWidth
                color={hasFile ? "primary" : isBaking ? "secondary" : "default"}
                startContent={<FaUtensils />}
                onClick={bake}
                disabled={isBaking || !hasFile}
                isLoading={isBaking}
              >
                Bake!
              </Button>
              <div className="mt-2 flex space-x-2">
                <Checkbox
                  isSelected={enableWatermark}
                  onValueChange={setEnableWatermark}
                >
                  Watermark
                </Checkbox>
                <Checkbox
                  isSelected={enableRandomWatermarkPosition}
                  onValueChange={setEnableRandomWatermarkPosition}
                  isDisabled={!enableWatermark}
                >
                  Random Position
                </Checkbox>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
