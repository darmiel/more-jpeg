import logging
from io import BytesIO

from PIL import Image
from flask import Flask, request, send_file, abort
from flask_cors import CORS
from flask_limiter import Limiter

from recipe import parse_ingredients, run_action
from watermark import parse_watermark

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

app = Flask(__name__)
CORS(app)


def get_remote_address():
    return request.headers.get('X-Forwarded-For', request.remote_addr)


limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri="memory://",
)


@app.route("/upload", methods=["POST"])
@limiter.limit("60 per minute")
def upload():
    try:
        quality = int(request.form.get('quality', '10'))
    except ValueError:
        return abort(400, "Cannot parse parameter/s")

    try:
        watermark = parse_watermark(request.form.get('watermark', ''))
    except Exception as e:
        return abort(400, "Cannot parse watermark", e)

    try:
        ingredients = parse_ingredients(request.form.get('ingredients', '[]'))
    except Exception as exception:
        return abort(400, exception)

    # read body image
    body_image = request.files['file']
    if not body_image:
        return abort(400, "It appears that you didn't upload an image.")
    try:
        img = Image.open(body_image.stream)
    except Exception:
        return abort(400, "The file you uploaded does not appear to be a valid image.")

    logging.info(f"{get_remote_address()} requested to enhance to " +
                 f"quality = {quality} with watermark = {str(watermark)}")

    # discard alpha channel (since JPEG can't handle alpha)
    if img.mode != "RGB":
        logging.info("  >> The uploaded image is not RGB. trying to convert.")
        try:
            img = img.convert("RGB")
        except Exception:
            return abort(400, "cannot convert image to RGB")

    # run ingredients
    for ingredient in ingredients:
        try:
            img = run_action(ingredient.identifier, ingredient.options, img)
        except Exception as exception:
            return abort(400, exception)

    # add watermark (if enabled)
    img = watermark.paint(img)

    # "enhance" quality and return
    out = BytesIO()
    img.save(out, 'JPEG', quality=quality)
    out.seek(0)
    logging.info(f"  >> Image enhanced to {out.getbuffer().nbytes} bytes")

    return send_file(out, mimetype="image/jpeg")


if __name__ == "__main__":
    app.run(debug=True)
