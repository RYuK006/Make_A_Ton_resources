const jwt = require('jsonwebtoken')

function authorize(req,res,next) {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(400).json({ error: "Token not found"});

    jwt.verify(token, process.env.ACCESSKEY, (err, user) => {
        if(err) return res.status(403).json({ error: 'Unauthorized access' });

        res.user = user;
        next()
    })
}

module.exports = { authorize }