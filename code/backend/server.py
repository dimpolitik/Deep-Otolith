"""
Main module of the server file
"""
import os

# 3rd party moudles
from flask import Flask, render_template, request, jsonify
from flask_bootstrap import Bootstrap
from flask_compress import Compress
from flask_cors import CORS
from flask_uploads import configure_uploads, IMAGES, UploadSet
import numpy as np
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.preprocessing.image import img_to_array
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import random

# init app
app = Flask(__name__)
Bootstrap(app)
# set CORS headers for React
CORS(app)
compress = Compress()
compress.init_app(app)
# set rate limit
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["2000 per day", "500 per hour"]
)
# configuration
# Using a development configuration
app.config.from_object('config.DevConfig')
if not os.path.exists(app.config["UPLOADED_IMAGES_DEST"]):
    os.makedirs(app.config["UPLOADED_IMAGES_DEST"])

# init image uploader
images = UploadSet('images', IMAGES)
configure_uploads(app, images)


# URL routes
@app.route("/")
@app.route("/index")
def home():
    return render_template("home_dimit.html")


@app.route("/fishtype")
def fishtype():
    ret = {"items": [{"model":k, "description":v['description']} for (k, v) in app.config["PREDICTORS"].items()]}
    return jsonify(ret)


@app.route("/predict", methods=["GET", "POST"])
@limiter.limit("150 per minute")
def predict():
    try:
        fishtype = request.form['fishType']
        if fishtype in app.config["PREDICTORS"]:
            predictor = app.config["PREDICTORS"][fishtype]

            for f in request.files.getlist('images'):
                # save file
                filename = images.save(request.files['images'])
                path = app.config["UPLOADED_IMAGES_DEST"] + filename
                # predict         
                if (fishtype == 'halibut'):
                    mu = np.load('mu_400.npy')
                    std = np.load('std_400.npy')
                    image = load_img(path, target_size=(224, 224, 3))
                    image = img_to_array(image)
                    image /= 255.0
                    image[:,:,0] -= mu[0]
                    image[:,:,1] -= mu[1]
                    image[:,:,2] -= mu[2]
                    image[:,:,0] /= std[0]
                    image[:,:,1] /= std[1]
                    image[:,:,2] /= std[2]
                    image = np.expand_dims(image, axis=0)           
                elif ((fishtype == 'sea-salmon') or (fishtype == 'river-salmon')):
                    image = load_img(path, target_size=(380, 380, 3))
                    image = img_to_array(image)
                    image /= 255.0
                    image = np.expand_dims(image, axis=0)           
                else:
                    image = load_img(path, target_size=(400, 400, 3))
                    image = img_to_array(image)
                    image /= 255.0
                    image = np.expand_dims(image, axis=0)
                            
                if ((fishtype == "redFish") or (fishtype == 'sea-salmon') or (fishtype == 'river-salmon')):
                    yhat = predictor["model"].predict(image)
                elif (fishtype == 'halibut'):
                    yhat = predictor["model"].predict(image)
                    yhat = np.exp(yhat)
                    yhat = yhat / yhat.sum()
                else:
                    yhat,_ = predictor["model"].predict(image)
                
                yhat = yhat.round(2)
                
                if (fishtype == "river-salmon"):
                    lst_age = [0] * 5 
                    ind = np.int(yhat)
                    lst_age[ind] = 1
                    ret = [ {'x': c, 'y': y } for c, y in zip (predictor['age-groups'], lst_age) ]
                elif (fishtype == "sea-salmon"):
                    lst_age = [0] * 8
                    ind = np.int(yhat)
                    lst_age[ind] = 1
                    ret = [ {'x': c, 'y': y } for c, y in zip (predictor['age-groups'], lst_age) ]     
                else:
                    ret = [ {'x': c, 'y': y } for c, y in zip (predictor['age-groups'], yhat[0].tolist()) ]
                  
                # cleanup
                os.remove(path) 
                
            return jsonify(ret)

    except Exception as e:
        print(e)

    return jsonify({}), 400


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(port=8000)
