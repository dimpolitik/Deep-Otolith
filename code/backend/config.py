from tensorflow.keras.models import load_model
from efficientnet.tfkeras import EfficientNetB4

class Config:
    """Base config."""
    SECRET_KEY = "Kvdik0$Loyk3t0"
    UPLOADED_IMAGES_DEST = "static/img/uploads/"
    # keras models configuration
    PREDICTORS = {}

class ProdConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False

class DevConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    PREDICTORS = {
        "redFish" : {
            "description" : "Red mullet (M. barbatus)",
            "model" : load_model('models/mullet.h5'),
            "age-groups" : ["0", "1", "2", "3", "4", "5+"]
        }, "halibut" : {
            "description" : "Greenland halibut (R. hippoglossoides)",
            "model" : load_model('models/norway.h5'),
            "age-groups" : [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", 
                             "12", "13", "14", "15", "16", "17", "18", "19", "20", "21",  
                             "22", "23", "24", "25", "26"]
        }, "river-salmon" : {
            "description" : "Atlantic salmon (Salmo salar L. 1758, river age)",
            "model" : load_model('models/salmon_river_age.hdf5', compile=False),
            "age-groups" : [ "1", "2", "3", "4", "5"]
        },  "sea-salmon" : {
            "description" : "Atlantic salmon (Salmo salar L. 1758, sea age)",
            "model" : load_model('models/salmon_sea_age.hdf5', compile=False),
            "age-groups" : [ "1", "2", "3", "4", "5", "6", "7", "8"]
        }, 
    }
