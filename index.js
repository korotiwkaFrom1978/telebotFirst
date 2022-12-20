const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '5692736441:AAH2q47iBV73eomVdTGzP-CLz1brle6iCfY';
const bot = new TelegramApi(token, {polling: true});
const chats = {};
/*const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}
const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'попробуй ещё разок, мазила...', callback_data: '/again'}]
        ]
    })
}*/

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'дай побалуемся: цифру загадаю от 0 до 9, а тебе угадать нада...');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'открой рот, закрой глаза...шучу ппля...отгадывай цифру!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'начальное приветствие'},
        {command: '/info', description: 'информация о пользователе'},
        {command: '/game', description: 'игра - угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b89/a76/b89a767b-f606-4609-9734-6ded4a996868/192/12.webp');
            return bot.sendMessage(chatId, 'здарова, атец!...или нет!?');
        };
        if(text === '/info') {
            return bot.sendMessage(chatId, `мне говорят, что ты называешь себя - ${msg.from.first_name} ${msg.from.last_name}.`);
        };
        if(text === '/game') {
            return startGame(chatId)
            /*await bot.sendMessage(chatId, 'дай побалуемся: цифру загадаю от 0 до 9, а тебе угадать нада...');
            const randomNumber = Math.floor(Math.random() * 10);
            chats[chatId] = randomNumber;
            return bot.sendMessage(chatId, 'открой рот, закрой глаза...шучу ппля...отгадывай цифру!', gameOptions);*/
        }
        return bot.sendMessage(chatId, 'не вдуплил, попробуй ещё разок, терь пользуя команды меню...');
    })

    bot.on('callback_query',async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `конгратс!прям в дырочку!действительна циферка - ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `совсем не снайпер...циферка была ${chats[chatId]}`, againOptions)
        }
        /*bot.sendMessage(chatId, `ля...кнопочка у тя нажалася с циферкой - ${data}...`);*/
    })
}

start();

