import PIL.Image as ImageNamespace
import numpy as np
from PIL import ImageEnhance, ImageFilter, ImageOps
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


def action_flip(img: Image, _: dict) -> Image:
    return ImageOps.flip(img)


def action_grayscale(img: Image, _: dict) -> Image:
    return ImageOps.grayscale(img)


def action_mirror(img: Image, _: dict) -> Image:
    return ImageOps.mirror(img)


def action_solarize(img: Image, options: dict) -> Image:
    return ImageOps.solarize(img, int(clamp(options.get('threshold', 128), 0, 255)))


def action_shift(img: Image, options: dict) -> Image:
    shift_x = int(img.size[0] * options.get('shift_x', 0.3))
    shift_y = int(img.size[1] * options.get('shift_y', 0.0))

    img = np.roll(img, shift_x, 1)
    img = np.roll(img, shift_y, 0)

    return ImageNamespace.fromarray(img)


def action_emboss(img: Image, _: dict) -> Image:
    return img.filter(ImageFilter.EMBOSS)


def action_blur(img: Image, options: dict) -> Image:
    return img.filter(ImageFilter.GaussianBlur(
        radius=clamp(options.get('radius', 2), 0, 100)
    ))


def action_edge_enhance(img: Image, _: dict) -> Image:
    return img.filter(ImageFilter.EDGE_ENHANCE)


def action_pixelate(img: Image, options: dict) -> Image:
    box_size = options.get('box_size', 10)
    return img.resize(
        (img.size[0] // box_size, img.size[1] // box_size),
        resample=ImageNamespace.BILINEAR
    ).resize(
        img.size,
        ImageNamespace.NEAREST
    )


def action_warhol(img: Image, _: dict) -> Image:
    img = img.convert('RGBA')
    width, height = img.size
    colors = ['red', 'green', 'blue', 'yellow']
    new_img = ImageNamespace.new('RGBA', (width * 2, height * 2))
    for i in range(2):
        for j in range(2):
            color = colors[i * 2 + j]
            overlay = ImageNamespace.new('RGBA', (width, height), color)
            new_img.paste(overlay, (i * width, j * height), overlay)
            overlay = ImageNamespace.new('RGBA', (width, height), (0, 0, 0, 50))
            new_img.paste(overlay, (i * width, j * height), overlay)
    new_img.paste(img, (width // 2, height // 2), img)
    return new_img.convert('RGB')


def action_cartoonize(img: Image, options: dict) -> Image:
    color_levels = int(options.get('color_levels', 6))
    img = img.quantize(colors=color_levels).convert("RGB")
    img = img.filter(ImageFilter.SMOOTH_MORE)
    return img


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
    },
    "flip": {
        "executor": action_flip,
    },
    "grayscale": {
        "executor": action_grayscale,
    },
    "mirror": {
        "executor": action_mirror,
    },
    "solarize": {
        "executor": action_solarize,
        "options": {
            "threshold": int,
        }
    },
    "emboss": {
        "executor": action_emboss
    },
    "blur": {
        "executor": action_blur,
        "options": {"radius": int}
    },
    "edge_enhance": {
        "executor": action_edge_enhance
    },
    "pixelate": {
        "executor": action_pixelate,
        "options": {"box_size": int}
    },
    "warhol": {
        "executor": action_warhol
    },
    "cartoonize": {
        "executor": action_cartoonize,
        "options": {"color_levels": int}
    },
}
