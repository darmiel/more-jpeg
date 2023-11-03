import { ReactNode } from "react"
import {
  FaArrowUpRightDots,
  FaCopy,
  FaFill,
  FaGlasses,
  FaStairs,
} from "react-icons/fa6"

export type Options = Record<string, unknown>

export type Ingredient = {
  id: string
  with?: Options
  disabled?: boolean
}

export type Recipe = {
  name: string
  description: string
  destroy_factor: number
  quality: number
  ingredients: Ingredient[]
}

export const recipes: Recipe[] = [
  {
    name: "Lite",
    description: "Adds a little bit of compression artifacts",
    destroy_factor: 10,
    quality: 10,
    ingredients: [], // no ingredients needed since the quality is 10
  },
  {
    name: "Noise",
    description: "Adds a little bit of noise",
    destroy_factor: 15,
    quality: 95,
    ingredients: [{ id: "noise", with: { amount: 0.1 } }],
  },
  {
    name: "Artifact Hell",
    description: "Adds a lot of compression artifacts",
    destroy_factor: 50,
    quality: 0,
    ingredients: [],
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
  },
]

export type IngredientMeta = {
  icon: ReactNode
  description: string
  param_info: Record<string, string>
}

export const ingredientMeta: Record<string, IngredientMeta> = {
  noise: {
    icon: <FaArrowUpRightDots />,
    description: "Adds random variation",
    param_info: {
      amount: "Amount of noise to add",
    },
  },
  sharpness: {
    icon: <FaGlasses />,
    description: "Enhances image edge definition",
    param_info: {
      factor: "Amount of sharpness to add",
    },
  },
  contrast: {
    icon: <FaCopy />,
    description: "Increases the visual difference between elements",
    param_info: {
      factor: "Amount of contrast to add",
    },
  },
  posterize: {
    icon: <FaStairs />,
    description: "Reduces image colors to distinct levels",
    param_info: {
      bits: "Number of bits to posterize to",
    },
  },
  invert: {
    icon: <FaFill />,
    description: "Reverses colors in the image",
    param_info: {},
  },
} as const
