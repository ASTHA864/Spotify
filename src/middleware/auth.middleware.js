const jwt = require("jsonwebtoken");

function authArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Authentication is not configured" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   

    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "You don't have access" });
    }
    req.user = decoded;
    next();
  } 
  catch(err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

async function authUser(req ,res , next){

  const token = req.cookies.token;
  if(!token) 
  {
    res.status(401).json({message : "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    if(decoded.role !== "user")
    {
      return res.status(403).json({ message : "You don't have access"})
    }
   
    req.user = decoded;
    next()
  }

  catch(err) {
     console.log(err);
     return res.status(401).json({message :
      "Unauthorized"
     })
  }
}


module.exports = { authArtist, authUser };
