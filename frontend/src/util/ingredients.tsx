import { ReactNode } from "react"
import {
  FaArrowUpRightDots,
  FaArrowsLeftRight,
  FaArrowsUpDown,
  FaBraille,
  FaCopy,
  FaFill,
  FaGlasses,
  FaMagnet,
  FaMoon,
  FaPen,
  FaShapes,
  FaStairs,
  FaStamp,
  FaUncharted,
  FaWaveSquare,
  FaWind,
} from "react-icons/fa6"

/**
 * Recipe parameters for a single ingredient.
 */
export type IngredientOptions = Record<string, unknown>

/**
 * An ingredient is a single modification that can be applied to an image.
 */
export type Ingredient = {
  id: string
  with?: IngredientOptions
  disabled?: boolean
}

/**
 * The option info for a single ingredient.
 * This is used to configure the ingredient in the UI.
 */
export type IngredientOptionInfo = {
  description: string
  default: unknown
}

/**
 * The info for a single ingredient.
 * This is used to display the ingredient in the UI.
 */
export type IngredientInfo = {
  icon: ReactNode
  description: string
  parameters: Record<string, IngredientOptionInfo>
}

export const ingredients: Record<string, IngredientInfo> = {
  exponential_noise: {
    icon: <FaArrowUpRightDots />,
    description: "Adds random variation",
    parameters: {
      scale: {
        description: "Amount of noise to add",
        default: 30,
      },
    },
  },
  sharpness: {
    icon: <FaGlasses />,
    description: "Enhances image edge definition",
    parameters: {
      factor: {
        description: "Amount of sharpness to add",
        default: 100,
      },
    },
  },
  contrast: {
    icon: <FaCopy />,
    description: "Increases the visual difference between elements",
    parameters: {
      factor: {
        description: "Amount of contrast to add",
        default: 100,
      },
    },
  },
  posterize: {
    icon: <FaStairs />,
    description: "Reduces image colors to distinct levels",
    parameters: {
      bits: {
        description: "Number of bits to posterize to",
        default: 2,
      },
    },
  },
  invert: {
    icon: <FaFill />,
    description: "Reverses colors in the image",
    parameters: {},
  },
  shift: {
    icon: <FaUncharted />,
    description: "Shifts the image",
    parameters: {
      shift_x: {
        description: "Amount to shift the image on the x axis",
        default: 0.3,
      },
      shift_y: {
        description: "Amount to shift the image on the y axis",
        default: 0.3,
      },
    },
  },
  flip: {
    icon: <FaArrowsUpDown />,
    description: "Flips the image",
    parameters: {},
  },
  mirror: {
    icon: <FaArrowsLeftRight />,
    description: "Mirror the image",
    parameters: {},
  },
  grayscale: {
    icon: <FaMoon />,
    description: "Grayscale the image",
    parameters: {},
  },
  solarize: {
    // TODO: find a better icon :)
    icon: <FaWaveSquare />,
    description: "Solarize the image",
    parameters: {
      threshold: {
        description: "Pixels above this greyscale level are inverted",
        default: 128,
      },
    },
  },
  emboss: {
    icon: <FaStamp />,
    description: "Creates an embossed effect",
    parameters: {},
  },
  blur: {
    icon: <FaWind />,
    description: "Blurs the image",
    parameters: {
      radius: {
        description: "Radius of blurring",
        default: 2,
      },
    },
  },
  edge_enhance: {
    icon: <FaMagnet />,
    description: "Enhances edges in the image",
    parameters: {},
  },
  pixelate: {
    icon: <FaBraille />,
    description: "Pixelates the image",
    parameters: {
      box_size: {
        description: "Size of pixelation boxes",
        default: 10,
      },
    },
  },
  warhol: {
    icon: <FaShapes />,
    description: "Applies a Warhol-like effect",
    parameters: {},
  },
  cartoonize: {
    icon: <FaPen />,
    description: "Converts the image into a cartoon-like representation",
    parameters: {
      color_levels: {
        description: "Number of color levels",
        default: 6,
      },
    },
  },
} as const
