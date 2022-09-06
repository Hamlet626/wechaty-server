const {bot} = require("./bot");
const {FileBox} = require("file-box");

exports.getContract=async(name,res)=>{
    let ctcs=name==null?await bot.Contact.findAll():await bot.Contact.findAll({name:name});
    res.send(ctcs.map((v)=>({id:v.id,name:v.name()})));
}

exports.getRoom=async(name,res)=>{
    let ctcs=name==null?await bot.Room.findAll():await bot.Room.findAll({topic:name});
    res.send(await Promise.all(
        ctcs.map(async(v)=>{
            let mb,topic;
            await Promise.all([
                v.memberAll().then((v)=>{mb=v;}),
                v.topic().then((v)=>{topic=v;})
            ]);
            return {id:v.id,members:mb.map((v)=>v.name()),topic:topic};
        })));
}

exports.sayToContact=async(isGroup,to,content,type,res)=>{
    let us;
    if(isGroup)us=await bot.Room.findAll({"topic":to});
    else us=await bot.Contact.findAll({"name":to});
    if(us.length===0)return res.status(241).send({error:`no user found by name ${to}`});
    if(us.length!==1)return res.status(242).send({error:`multiple users found by name ${to}`});

    await sentMsg(us[0],content,type);
    return res.status(200).send({success:true});
}

exports.sayToCid=async(cid,content,type,res)=>{
    let ctc=bot.Contact.load(cid);
    await sentMsg(ctc,content,type);
    return res.status(200).send({success:true});
}

exports.sayToRoom=async(rid,content,type,res)=>{
    let room=bot.Room.load(rid);
    await sentMsg(room,content,type);
    return res.status(200).send({success:true});
}

const sentMsg=async(contact,content,type)=>{
    switch (type) {
        case 1: const file = FileBox.fromUrl(content);
            await contact.say(file);break;
        case 2: const contactCard = bot.Contact.load(content);
            await contact.say(contactCard);break;
            ///todo:test urlLink
        case 3: const urlLink = bot.UrlLink({description : 'test description',
            thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
            title: 'Profile',
            url: content,  });//await bot.UrlLink.create(content);
            // const urlLink = new UrlLink ({    description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',    thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',    title       : 'Welcome to Wechaty',    url         : 'https://github.com/wechaty/wechaty',  });
        await contact.say(urlLink)
            // const msg = await contact.say(urlLink);
            break;
        default: await contact.say(content);break;
    }
}


