from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

from flask import Flask, request, render_template, send_file, abort

from random import randint

app = Flask(__name__)

@app.route("/example.png")
def file_example():
    return send_file("templates/example.png")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    try:
        quality = int(request.form.get('quality', '10'))
        watermark_size = int(request.form.get('watermark_size', '18'))
    except:
        return abort(400, "Cannot parse parameter/s")
    randomize_position = request.form.get('randomize', 'off') == "on"
    watermark = request.form.get('watermark', 'off') == "on"

    # read body image
    body_image = request.files['file']
    if not body_image:
        return abort(400, "It appears that you didn't upload an image.")
    try:
        img = Image.open(body_image.stream)
    except:
        return abort(400, "The file you uploaded does not appear to be a valid image.")

    print("[Info]", request.remote_addr, "requested to enhance '", body_image.name, "' to quality =", quality, "with watermark/randomize =", watermark, randomize_position)

    # discard alpha channel (since JPEG can't handle alpha)
    if img.mode != "RGB":
        print("  [Debug] The uploaded image is not RGB. trying to convert.")
        try:
            img = img.convert("RGB")
        except:
            return abort(400, "cannot convert image to RGB")

    # add watermark
    if watermark:
        draw = ImageDraw.Draw(img)
        text = "jpeg.qwer.tz"
        font = ImageFont.truetype("arial.ttf", watermark_size)
        
        text_width, text_height = draw.textsize(text, font)

        if randomize_position:
            text_position = (randint(20, img.width - text_width - 20), randint(10, img.height - text_height - 10))
        else:
            text_position = ((img.width - text_width) - 20, (img.height - text_height) - 10)
        print("  [Debug] Watermark position:", text_position)
            
        background_position = (text_position[0] - 10, text_position[1] - 5)
        background_dimensions = (text_width + 20, text_height + 10)

        draw.rectangle([background_position, (background_position[0] + background_dimensions[0], background_position[1] + background_dimensions[1])], fill="red")
        draw.text(text_position, text, font=font, fill="yellow")

    # "enhance" quality and return
    out = BytesIO()
    img.save(out, 'JPEG', quality=quality)
    out.seek(0)
    print("  [Debug] Image enhanced to", out.getbuffer().nbytes, "bytes")

    return send_file(out, mimetype="image/jpeg")

if __name__ == "__main__":
    app.run(debug=True)