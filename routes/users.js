// here we have path and routes for users (after the user is logged in)

import express from "express";
import{
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// if the user want to view some {id} profile, that id can be used for getting the data, this is called query-string, where the id is fetched from the url and processed further
// CRUD (create read update delete)
// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE
router.patch("/:id/:friendsId", verifyToken, addRemoveFriend);

export default router;