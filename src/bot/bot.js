/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
require('dotenv').config();
const {ScanStatus, log, WechatyBuilder} = require("wechaty");
const qrcodeTerminal = require("qrcode-terminal");
const {errorNotify} = require("../sendGrid");
// const {parseMsg} = require("../dialog_flow/dialog_flow");

let savedCode;
exports.getQRCode=()=>savedCode;

function onScan (qrcode, status) {
    console.log("in onscan");
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('');

        savedCode=qrcodeImageUrl;
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

function onLogin (user) {
    log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
    log.info('StarterBot', '%s logout', user)
}

const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    /**
     * How to set Wechaty Puppet Provider:
     *
     *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
     *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
     *
     * You can use the following providers:
     *  - wechaty-puppet-wechat (no token required)
     *  - wechaty-puppet-padlocal (token required)
     *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
     *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
     */
    // puppet: 'wechaty-puppet-wechat',
    puppet: process.env.BOT_NAME,
    puppetOptions: {token:process.env.BOT_TOKEN},
})
exports.bot=bot;

bot.on('scan',    onScan);
bot.on('login',   onLogin);
bot.on('logout',  onLogout);
bot.on('error',errorNotify);
bot.on("friendship",async(friendship)=>{});
bot.on("message",async(msg)=>{
    // const contact = msg.from();
    // const text = msg.text();
    // const room = msg.room();
    // let res;
    // if(room) let res=await parseMsg(msg.text(),room.id);
    // if(!!res)msg.say(res);
});

bot.start()
    .then(() => {
        console.log(Object.getOwnPropertyNames(bot));
        log.info('StarterBot', 'Starter Bot Started.');})
    .catch(e => {
        log.error('StarterBot', e);
        errorNotify(e);});



