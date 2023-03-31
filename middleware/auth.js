import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        // jwt token sent to frontend after login will be stored in the headers by the frontend in the form : 'Bearer <token>'
        // so we are getting that token
        let token = req.header("Authorization");

        // if token is not there, that means the user is not authenticated/loggedIn
        if(!token) {
            return res.status(403).send("Access Denied");
        }

        // actual token is extracted by slicing the string
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // now we check the token stored is valid or not using our secret_string we passed when we encrypted the password in login function
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        // next() is used to proceed with the actual function after this, as this is our middleware(it runs before the actual function of the route)
        next();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}