const {bot, getQRCode} = require("./bot");
const {FileBox} = require("wechaty");
const {getContract, sayToContact, sayToCid, getRoom, sayToRoom} = require("./handler");

const express = require('express')
const router = express.Router()

/***
 * make sure wc is connected
 * below api all requires /wct/...
 */
router.use((req, res, next) => {
    if(!bot.isLoggedIn)return res.status(240).send({error:"user not logged in"});
    next();
})

/***
 * @requires wct
 */
router.get("/ready",async(req,res,next)=>{
    await bot.ready()
    res.send({success:true});
});
/***
 * this api find contacts by name and sends msg to him
 * @requires wct
 * @deprecated find and set a contact id, then send by contact id instead
 * post
 * body:{isGroup:bool,to:String,contentType:int,content:String|Map}
 */
router.post("/say",async(req,res,next)=>{
    await sayToContact(req.body.isGroup,req.body.to,
        req.body.content,req.body.contentType||0,res);
});

/***
 * @requires wct
 * @deprecated currently nowhere send to individual
 * body:{name:String}
 */
router.post("/findContact",async(req,res,next)=>{
    await getContract(req.body.name,res);
});

/***
 * @requires wct
 * @deprecated currently nowhere send to individual
 * body:{cid:String,content:String|Map,contentType:int}
 */
router.post("/sayToCtc",async(req,res,next)=>{
    await sayToCid(req.body.cid,req.body.content,req.body.contentType||0,res);
});

/***
 * @requires wct
 * body:{name:String}
 * res:[
 *     {id:String, members:[mbName1:String,mbName1:String], topic:String},
 *     ...]
 */
router.post("/findRoom",async(req,res,next)=>{
    await getRoom(req.body.name,res);
});

/***
 * @requires wct
 * body:{rid:String,content:String|Map,contentType:int}
 */
router.post("/sayToRoom",async(req,res,next)=>{
    await sayToRoom(req.body.rid,req.body.content,req.body.contentType||0,res);
});

// module.exports = router;

exports.apis=(app)=>{
    app.get("/getQRCode",(req,res,next)=>{
        res.send(getQRCode());
    });

    app.get("/getOnOff",(req,res,next)=>{
        res.send(bot.isLoggedIn);
    });

    app.get("/logOut",async(req,res,next)=>{
        await bot.logout();
        res.send({success:true});
    });

    app.post("/bot",async(req,res,next)=>{
        if(req.body.stop)await bot.stop();
        else await bot.start();
        res.send({success:true});
    });

    app.use("/wct",router);
}
