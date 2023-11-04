import { Ingredient } from "@/util/ingredients"

/**
 * A recipe is a collection of ingredients that can be applied to an image.
 */
export type Recipe = {
  name: string
  description: string
  destroy_factor: number
  quality: number
  ingredients: Ingredient[]
  preview: string
}

/**
 * A list of recipes that can be applied to an image.
 */
export const recipes: Recipe[] = [
  {
    name: "No Recipe",
    description: "No modifications",
    destroy_factor: 0,
    quality: 100,
    ingredients: [],
    preview: "/chick.jpg",
  },
  {
    name: "Lite",
    description: "Adds a little bit of compression artifacts",
    destroy_factor: 10,
    quality: 10,
    ingredients: [], // no ingredients needed since the quality is 10
    preview: "/examples/lite.jpeg",
  },
  {
    name: "Noise",
    description: "Adds a little bit of noise",
    destroy_factor: 15,
    quality: 95,
    ingredients: [{ id: "exponential_noise", with: { scale: 30 } }],
    preview: "/examples/noise.jpeg",
  },
  {
    name: "Artifact Hell",
    description: "Adds a lot of compression artifacts",
    destroy_factor: 50,
    quality: 0,
    ingredients: [],
    preview: "/examples/artifact-hell.jpeg",
  },
  {
    name: "Pro+",
    description: "Completely destroy your image",
    destroy_factor: 90,
    quality: 0,
    ingredients: [
      { id: "sharpness", with: { factor: 100 } },
      { id: "contrast", with: { factor: 100 } },
      { id: "posterize", with: { bits: 2 } },
      { id: "invert" },
    ],
    preview: "/examples/pro-plus.jpeg",
  },
]
