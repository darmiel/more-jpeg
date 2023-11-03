import PIL.Image as ImageNamespace
import numpy as np
from PIL import ImageEnhance, ImageOps
from PIL.Image import Image


def clamp(value: float, min_value: float, max_value: float) -> float:
    return min(max_value, max(min_value, value))


def action_sharpness(img: Image, options: dict) -> Image:
    return ImageEnhance.Sharpness(img).enhance(clamp(options.get('factor', 100), 0, 1000))


def action_contrast(img: Image, options: dict) -> Image:
    return ImageEnhance.Contrast(img).enhance(clamp(options.get('factor', 100), 0, 100))


def action_invert(img: Image, _: dict) -> Image:
    return ImageOps.invert(img)


def action_posterize(img: Image, options: dict) -> Image:
    return ImageOps.posterize(img, int(options.get("bits", 4)))


def action_exponential_noise(img: Image, options: dict) -> Image:
    image_array = np.array(img)
    image_array = (image_array + np.random.exponential(
        scale=options.get('scale', 0),
        size=image_array.shape
    )).astype(
        'uint8')
    return ImageNamespace.fromarray(image_array)


def action_shift(img: Image, options: dict) -> Image:
    shift_x = int(img.size[0] * options.get('shift_x', 0.3))
    shift_y = int(img.size[1] * options.get('shift_y', 0.0))

    img = np.roll(img, shift_x, 1)
    img = np.roll(img, shift_y, 0)

    return ImageNamespace.fromarray(img)


actions = {
    "sharpness": {
        "executor": action_sharpness,
        "options": {"factor": [float, int]}
    },
    "contrast": {
        "executor": action_contrast,
        "options": {"factor": [float, int]}
    },
    "invert": {
        "executor": action_invert
    },
    "posterize": {
        "executor": action_posterize,
        "options": {"bits": int}
    },
    "exponential_noise": {
        "executor": action_exponential_noise,
        "options": {"scale": [float, int]}
    },
    "shift": {
        "executor": action_shift,
        "options": {
            "shift_x": [float, int],
            "shift_y": [float, int]
        }
    }
}
