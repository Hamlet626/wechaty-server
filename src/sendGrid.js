require('dotenv').config();
const client = require('@sendgrid/mail');

client.setApiKey(process.env.SENDGRID_KEY);

const template = (subject,data)=>{
    return{to:{name:"Hamlet",email:"wenjian@patriotconceptions.com"},
    from:{name:"Wechaty Backend",email:"info@patriotconceptions.com"},
    subject:subject, text:data};};

exports.errorNotify= async(data)=>client.send(template("wechaty error!",
    `There was an error in wechaty:\n${data}`));

// exports.errorNotify= async(data)=>{}



