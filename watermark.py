import json
import logging
from random import randint

from PIL import ImageDraw, ImageFont
from PIL.Image import Image


class Watermark:
    def __init__(self, text: str, size: int, fg_color: str, bg_color: str, randomize_position: bool):
        self.text = text
        self.size = size
        self.fg_color = fg_color
        self.bg_color = bg_color
        self.randomize_position = randomize_position

    def __str__(self):
        return f"text='{self.text}',size={self.size},rpos={self.randomize_position}," + \
            f"fg='{self.fg_color}',bg='{self.bg_color}'"

    def paint(self, img: Image) -> Image:
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype("arial.ttf", self.size)

        text_width, text_height = draw.textsize(self.text, font)

        if self.randomize_position:
            text_position = (randint(20, img.width - text_width - 20), randint(10, img.height - text_height - 10))
        else:
            text_position = ((img.width - text_width) - 20, (img.height - text_height) - 10)

        background_position = (text_position[0] - 10, text_position[1] - 5)
        background_dimensions = (text_width + 20, text_height + 10)

        draw.rectangle((
            background_position,
            (background_position[0] + background_dimensions[0], background_position[1] + background_dimensions[1])
        ), fill=self.bg_color)
        draw.text(text_position, self.text, font=font, fill=self.fg_color)

        return img


class NoWatermark(Watermark):
    def __init__(self):
        super().__init__("", 0, "", "", False)

    def __str__(self):
        return "no watermark"

    def paint(self, img: Image) -> Image:
        return img


NO_WATERMARK = NoWatermark()


def parse_watermark(options_json: str) -> Watermark:
    if options_json == "":
        return NO_WATERMARK
    if not isinstance(options := json.loads(options_json), dict):
        raise ValueError("invalid JSON")
    if (text := options.get("text", "jpeg.qwer.tz")) == "":
        return NO_WATERMARK

    size = options.get("size", 18)
    fg_color = options.get("foregroundColor", "#facc15")
    bg_color = options.get("backgroundColor", "#ff0000")
    randomize_position = options.get("randomizePosition", False)

    if not isinstance(text, str) \
            or not isinstance(size, int) \
            or not isinstance(fg_color, str) \
            or not isinstance(bg_color, str) \
            or not isinstance(randomize_position, bool):
        raise ValueError("invalid JSON")

    return Watermark(text, size, fg_color, bg_color, randomize_position)
