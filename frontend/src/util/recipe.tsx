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
    name: "Clean",
    description: "A clean image with no modifications",
    destroy_factor: 0,
    quality: 100,
    ingredients: [],
  },
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
    ingredients: [{ id: "exponential_noise", with: { scale: 30 } }],
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
      { id: "exponential_noise", with: { scale: 50 } },
    ],
  },
]

export type ParamInfo = {
  description: string
  default: unknown
}

export type IngredientMeta = {
  icon: ReactNode
  description: string
  param_info: Record<string, ParamInfo>
}

export const ingredientMeta: Record<string, IngredientMeta> = {
  exponential_noise: {
    icon: <FaArrowUpRightDots />,
    description: "Adds random variation",
    param_info: {
      scale: {
        description: "Amount of noise to add",
        default: 30,
      },
    },
  },
  sharpness: {
    icon: <FaGlasses />,
    description: "Enhances image edge definition",
    param_info: {
      factor: {
        description: "Amount of sharpness to add",
        default: 100,
      },
    },
  },
  contrast: {
    icon: <FaCopy />,
    description: "Increases the visual difference between elements",
    param_info: {
      factor: {
        description: "Amount of contrast to add",
        default: 100,
      },
    },
  },
  posterize: {
    icon: <FaStairs />,
    description: "Reduces image colors to distinct levels",
    param_info: {
      bits: {
        description: "Number of bits to posterize to",
        default: 2,
      },
    },
  },
  invert: {
    icon: <FaFill />,
    description: "Reverses colors in the image",
    param_info: {},
  },
} as const
