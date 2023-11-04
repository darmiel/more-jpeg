"use client"

import IngredientCard from "@/components/ingredient/IngredientCard"
import QualityCard from "@/components/ingredient/QualityCard"
import ModalExport from "@/components/modals/ModalExport"
import ModalImport from "@/components/modals/ModalImport"
import PopoverAddIngredient from "@/components/modals/PopoverAddIngredient"
import RecipeCard from "@/components/recipe/RecipeCard"
import Warning from "@/components/ui/Warning"
import { useSearch } from "@/context/SearchContext"
import { IngredientOptions, ingredients } from "@/util/ingredients"
import { Recipe, recipes } from "@/util/recipe"
import { WatermarkOptions } from "@/util/types"
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Input,
  Link,
  Modal,
  ModalContent,
  ScrollShadow,
  Slider,
  Tooltip,
} from "@nextui-org/react"
import clsx from "clsx"
import { SetStateAction, useRef, useState } from "react"
import { SliderPicker } from "react-color"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider"
import {
  FaArrowDown,
  FaArrowUp,
  FaBolt,
  FaCircleDot,
  FaDownload,
  FaExpand,
  FaEye,
  FaEyeSlash,
  FaFile,
  FaFileExport,
  FaFileImport,
  FaGear,
  FaRecycle,
  FaStar,
  FaUtensils,
} from "react-icons/fa6"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

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
  const [selectedRecipe, _setSelectedRecipe] = useState<Recipe>(
    deepCopy(recipes[0]),
  )

  // Import / Export
  const [modalImportOpen, setModalImportOpen] = useState(false)
  const [modalExportOpen, setModalExportOpen] = useState(false)

  // Watermark
  const [watermarkText, setWatermarkText] = useState("jpeg.qwer.tz")
  const [watermarkTextColor, setWatermarkTextColor] = useState("#facc15")
  const [watermarkBackgroundColor, setWatermarkBackgroundColor] =
    useState("#ff0000")
  const [enableRandomWatermarkPosition, setEnableRandomWatermarkPosition] =
    useState(true)
  const [watermarkSize, setWatermarkSize] = useState(18)

  // Bake
  const [sourcePreview, setSourcePreview] = useState("")
  const [bakedPreview, setBakedPreview] = useState("")
  const [modalPreview, setModalPreview] = useState("")
  const [bakedError, setBakedError] = useState("")
  const [isBaking, setIsBaking] = useState(false)
  const [autoBake, setAutoBake] = useState(true)
  const [shouldAutoBake, _setShouldAutoBake] = useState(false)
  const [hideBakePreview, setHideBakePreview] = useState(false)
  const [expandBakePreview, setExpandBakePreview] = useState(false)

  const { search, setSearch } = useSearch()
  const filteredRecipes = recipes.filter((recipe) => {
    return (
      !search || recipe.name.toLowerCase().includes(search.toLocaleLowerCase())
    )
  })

  const [files, setFiles] = useState<FileList | null>()
  const hasFile = files && files.length > 0
  const fileRef = useRef<HTMLInputElement>(null)

  if (shouldAutoBake) {
    autoBake && bake()
    _setShouldAutoBake(false)
  }

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
    data.append(
      "watermark",
      JSON.stringify({
        text: watermarkText,
        size: watermarkSize,
        foregroundColor: watermarkTextColor,
        backgroundColor: watermarkBackgroundColor,
        randomizePosition: enableRandomWatermarkPosition,
      } as WatermarkOptions),
    )
    data.append("randomize", enableRandomWatermarkPosition ? "on" : "off")
    data.append("quality", selectedRecipe.quality.toString())
    data.append("ingredients", JSON.stringify(ingredients))
    data.append("file", files![0])

    setIsBaking(true)
    const resp = await fetch(BACKEND_URL + "/upload", {
      method: "POST",
      body: data,
    })
    setIsBaking(false)

    if (!resp.ok) {
      setBakedPreview("")
      setBakedError(await resp.text())
      return
    }

    setBakedPreview(URL.createObjectURL(await resp.blob()))
  }

  function setSelectedRecipe(newRecipe: SetStateAction<Recipe>) {
    _setSelectedRecipe(newRecipe)
    _setShouldAutoBake(true)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 p-4">
      {/* File Selection */}
      <section className="space-y-2">
        {bakedError ? (
          <Warning warning={bakedError} />
        ) : bakedPreview ? (
          <>
            <div className="flex flex-wrap justify-between space-x-2 md:flex-row">
              <div className="flex flex-wrap items-center space-x-2 md:flex-row">
                {files && files[0].name && (
                  <code className="bg-neutral-800 px-2 py-1">
                    {files[0].name.length > 20
                      ? files[0].name.slice(0, 20) + "..."
                      : files[0].name}
                  </code>
                )}
                <Tooltip content="Hide Preview">
                  <Button
                    isIconOnly
                    startContent={hideBakePreview ? <FaEyeSlash /> : <FaEye />}
                    variant={hideBakePreview ? "bordered" : "solid"}
                    size="sm"
                    onClick={() => setHideBakePreview((prev) => !prev)}
                  />
                </Tooltip>
                <Tooltip content="Expand Preview">
                  <Button
                    isIconOnly
                    startContent={
                      expandBakePreview ? <FaArrowUp /> : <FaArrowDown />
                    }
                    variant={expandBakePreview ? "solid" : "bordered"}
                    size="sm"
                    onClick={() => setExpandBakePreview((prev) => !prev)}
                    isDisabled={hideBakePreview}
                  />
                </Tooltip>
                <Modal
                  size="5xl"
                  isOpen={!!modalPreview}
                  onClose={() => setModalPreview("")}
                >
                  <ModalContent>
                    {/* Ignoring this error since it's only a blob */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="full-preview" src={modalPreview} />
                  </ModalContent>
                </Modal>
                <Tooltip content="Full Preview">
                  <Button
                    isIconOnly
                    startContent={<FaExpand />}
                    size="sm"
                    variant="bordered"
                    onClick={() => {
                      setModalPreview(bakedPreview)
                    }}
                  />
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
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
            </div>
            {!hideBakePreview && (
              <ReactCompareSlider
                className={clsx(
                  "items-center justify-center overflow-hidden rounded-lg",
                  {
                    "h-96": !expandBakePreview,
                  },
                )}
                itemOne={
                  <ReactCompareSliderImage
                    src={sourcePreview}
                    alt="Image one"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage src={bakedPreview} alt="Image two" />
                }
              />
            )}
          </>
        ) : (
          <div className="flex h-52 w-full animate-pulse flex-col items-center justify-center space-y-2 rounded-lg bg-neutral-800">
            <input
              type="file"
              accept="image/jpeg,image/png"
              ref={fileRef}
              onChange={(event) => {
                setFiles(event.currentTarget.files)
                if (event.currentTarget.files) {
                  const blobUrl = URL.createObjectURL(
                    event.currentTarget.files[0],
                  )
                  setSourcePreview(blobUrl)
                  setBakedPreview(blobUrl)
                } else {
                  setSourcePreview("")
                }
              }}
              hidden
            />
            <Button
              onClick={() => fileRef?.current?.click()}
              startContent={<FaFile />}
            >
              Select Image
            </Button>
            <span className="text-small text-neutral-400">
              Maximum Size: <span className="text-white">20MB</span>
            </span>
          </div>
        )}
      </section>

      {/* Recipes */}
      <section className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex flex-grow flex-col">
          <h1 className="mb-2 space-x-2 text-lg font-bold text-white">
            <span>Recipes</span>
            <Chip variant="faded">{filteredRecipes.length}</Chip>
          </h1>
          <div className="xlg:grid-cols-4 grid max-w-4xl gap-2 md:grid-cols-2 lg:grid-cols-3 lg:text-left">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                recipe={recipe}
                key={recipe.name}
                isSelected={recipe.name === selectedRecipe.name}
                onSelect={() => {
                  setSelectedRecipe(deepCopy(recipe))
                }}
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
        <div className="flex w-[25rem] flex-col">
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
                    recipes.push(newRecipe)
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
          <section className="w-full space-y-3">
            <QualityCard
              key={selectedRecipe.name + "-" + selectedRecipe.quality}
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

            <hr className="border-neutral-800" />

            <ScrollShadow className="flex max-h-96 flex-col space-y-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <IngredientCard
                  key={index}
                  meta={ingredients[ingredient.id]}
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
                  onRemove={() => {
                    // remove by index
                    setSelectedRecipe((prev) => {
                      return {
                        ...prev,
                        ingredients: prev.ingredients.filter(
                          (_, i) => i !== index,
                        ),
                      }
                    })
                  }}
                  options={ingredient.with}
                />
              ))}
            </ScrollShadow>

            <PopoverAddIngredient
              onAdd={(name, meta) => {
                const options: IngredientOptions = {}
                meta.parameters &&
                  Object.entries(meta.parameters).forEach(([name, info]) => {
                    info.default !== undefined && (options[name] = info.default)
                  })
                setSelectedRecipe((prev) => {
                  return {
                    ...prev,
                    ingredients: [
                      ...prev.ingredients,
                      {
                        id: name,
                        with: options,
                        disabled: false,
                      },
                    ],
                  }
                })
              }}
            />

            <hr className="border-neutral-800" />

            <section>
              <div className="flex items-center space-x-2">
                <Button
                  fullWidth
                  color={
                    hasFile ? "primary" : isBaking ? "secondary" : "default"
                  }
                  startContent={<FaUtensils />}
                  onClick={bake}
                  disabled={isBaking || !hasFile}
                  isLoading={isBaking}
                >
                  Bake!
                </Button>

                <Tooltip
                  content={`Auto Bake: ${autoBake ? "enabled" : "disabled"}`}
                >
                  <Button
                    isIconOnly
                    startContent={autoBake ? <FaBolt /> : <FaCircleDot />}
                    color={autoBake ? "secondary" : "default"}
                    onClick={() => setAutoBake((prev) => !prev)}
                  />
                </Tooltip>
              </div>
              <Accordion>
                <AccordionItem
                  title={
                    <div className="flex justify-between">
                      <span>Watermark Settings</span>
                      <Checkbox
                        isDisabled
                        isSelected={!!watermarkText}
                        size="sm"
                      />
                    </div>
                  }
                  startContent={<FaGear />}
                  isCompact
                >
                  <section className="flex flex-col space-y-3">
                    {watermarkText ? (
                      <span
                        className="w-full rounded-md border border-transparent p-2 text-center font-semibold"
                        style={{
                          backgroundColor: watermarkBackgroundColor,
                          color: watermarkTextColor,
                        }}
                      >
                        {watermarkText}
                      </span>
                    ) : (
                      <span className="w-full rounded-md border border-dashed border-neutral-600 p-2 text-center">
                        No Watermark
                      </span>
                    )}
                    <Input
                      type="text"
                      label="Watermark Text"
                      description="Leave empty to disable watermark"
                      defaultValue="jpeg.qwer.tz"
                      variant="bordered"
                      size="sm"
                      value={watermarkText}
                      onValueChange={setWatermarkText}
                    />

                    <Slider
                      minValue={4}
                      maxValue={64}
                      value={watermarkSize}
                      onChange={(newSize) =>
                        setWatermarkSize(newSize as number)
                      }
                      step={1}
                      size="sm"
                      label="Watermark Size"
                      getValue={(val) => `${val}pt`}
                      color="foreground"
                    />

                    <div
                      className="space-y-2 rounded-md border bg-neutral-800 px-3 pb-3 pt-2"
                      style={{
                        borderColor: watermarkTextColor,
                      }}
                    >
                      <strong
                        style={{
                          color: watermarkTextColor,
                        }}
                      >
                        Foreground
                      </strong>
                      <SliderPicker
                        color={watermarkTextColor}
                        onChange={(newColor) =>
                          setWatermarkTextColor(newColor.hex)
                        }
                        onChangeComplete={() => autoBake && bake()}
                      />
                    </div>

                    <div
                      className="space-y-2 rounded-md border bg-neutral-800 px-3 pb-3 pt-2"
                      style={{
                        borderColor: watermarkBackgroundColor,
                      }}
                    >
                      <strong
                        style={{
                          color: watermarkBackgroundColor,
                        }}
                      >
                        Background
                      </strong>
                      <SliderPicker
                        color={watermarkBackgroundColor}
                        onChange={(newColor) =>
                          setWatermarkBackgroundColor(newColor.hex)
                        }
                        onChangeComplete={() => autoBake && bake()}
                      />
                    </div>
                    <Checkbox
                      isSelected={enableRandomWatermarkPosition}
                      onValueChange={setEnableRandomWatermarkPosition}
                      isDisabled={!watermarkText}
                    >
                      Random Position
                    </Checkbox>
                  </section>
                </AccordionItem>
              </Accordion>
              <div className="mt-2 flex space-x-2"></div>
            </section>
          </section>
        </div>
      </section>
    </main>
  )
}
