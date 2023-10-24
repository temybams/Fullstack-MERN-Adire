import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cors from 'cors';
import cloudinary from 'cloudinary';
import fileupload from 'express-fileupload';
import passportConfig from './config/passportConfig';

import googleRouter from './routes/googleRoutes';
import userRouter from './routes/userRoutes';
import customerRouter from './routes/customerRoutes';
import orderRouter from './routes/orderRoutes';
import connectDB from './config/dbConfig';

dotenv.config();
connectDB();
const app: Application = express();

app.use(
  fileupload({
    useTempFiles: true,
  }),
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME! as string,
  api_key: process.env.CLOUDINARY_API_KEY! as string,
  api_secret: process.env.CLOUDINARY_API_SECRET! as string,
});

app.use(cors());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY!],
  }),
);

app.use(passportConfig.initialize());
app.use(passportConfig.session());

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'Server started' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.use('/auth/', googleRouter);
app.use('/adire/user/', userRouter);
app.use('/adire/customer/', customerRouter);
app.use('/adire/order/', orderRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.messsage = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  console.log(err);
  res.render('error');
});

export default app;
