const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require("./config/config");
const rimRaf = require('rimraf');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./api/middleware/auth');

mongoose.connect(config.mongoURI,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
);
mongoose.Promise = global.Promise;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
// app.use(morgan("dev"));
// app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200);
    }
    next();
  });


app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
        throw new Error('Not Authenticated')
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No File Provided' });
    }
    if (req.body.oldPath) {
        rimRaf(req.body.oldPath, function(err) {
            if (err){
                throw(err);
            }
        });
        // clearImage(req.body.oldPath);
    }
    return res.status(201)
    .json({message: 'file stored', filePath: req.file.path});
});

app.use(
    '/graphql', 
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        customFormatErrorFn(err) {
            if(!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An Error Occured';
            const code = err.originalError.code || 500;
            return { message: message, status:code, data:data };
        }
    })
);

app.use((error, req, res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});


module.exports = app;
