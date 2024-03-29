import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import conversationRoutes from "./routes/conversation.js"
import messagesRoutes from "./routes/messages.js"
import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";

// // CONFIGURATION

// these two configuration are required because we added the type as "module" in package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
// it sets the directory of where we are storing our images
// here it is stored locally but we can store it on cloud and update the path here
// app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// // FILE STORAGE
// whenever a file is uploaded, the image would get stored at this location
// in our case its "public/assets"
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "public/assets");
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname);
//      }
// });
// const upload = multer({storage});

// ROUTES WITH FILES UPLOAD FEATURE HAS TO BE DEFINED HERE BECAUSE WE NEED THE UPLOAD FUNCTION AS MIDDLEWARE, AND THE UPLOAD MIDDLEWARE HAS TO BE DEFINED IN INDEX.JS FILE
// there is a route "/auth/register" whenever it is hitted, first runs the middleware(upload.single()) then actual function runs (register)
app.post("/auth/register", register);
app.post("/posts", verifyToken, createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messagesRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, ()=>console.log(`Server running on port : ${PORT}`));
}).catch((error)=>{
    console.log(`${error} didn't connect :(`)
})