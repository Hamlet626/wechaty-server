
require('dotenv').config();

const apiError=(err, req, res, next)=> {
    console.error(err.stack);
    res.status(402).send({error:err.message,stack:err.stack});
}
exports.apiError=apiError;

const auth=(req,res,next)=>{
    if (req.headers.wckey!==process.env.AUTH_KEY)
        return res.status(403).json({ error: 'Wrong authentication key!' });
    next();
}
exports.auth=auth;

exports.cHandler=(app)=>{
    app.use(auth);
    app.use(apiError);
}


