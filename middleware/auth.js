const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    //check if no token
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    //verify the token
    try{
        const decoded = jwt.verify(token, process.env.jwtSecret);

        req.user = decoded.user;

        next();
    }catch(err){
        res.status(401).json({ msg: 'Token is not valid' })
    }
}