import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        // we'll get the userID from the params and then we search for that user in DB and return the user we got from the DB.
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message:err.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // we'll get the userID from the params and then we search for that user in DB and return the user we got from the DB.
        const allUsers = await User.find({});
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(404).json({message:err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        
        // we'll use Promise because we are going to call multiple api calls to DB here
        // here we are extrating the details of all the friends of the user by using their ID stored in the array of friends in USER object
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // we are going extract the data that will be required by the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message})
    }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        // get user and the friend ID from the params
        const {id, friendsId} = req.params;
        // find that user and friend in the DB
        const user = await User.findById(id);
        // const friend = await User.findById(friendsId) | [];

        // if that friend already exist in the user's friends list then 
        // add all the friends back to his/her friends list except that friendsId
        // (else) if that friendsId doesnt exist in the list friends of user then push that Id to the friends list of user
        if (user.friends.includes(friendsId)) {
            user.friends = user.friends.filter((id) => id !== friendsId);
            // friend.friends = friend.friends.filter((id) => id !== id);
          } else {
            user.friends.push(friendsId);
            // friend.friends.push(id);
          }
          await user.save();
        //   await friend.save();
      
          const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
          );
        // we are going extract the data that will be required by the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}