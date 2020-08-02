require('dotenv').config();

const {Telegraf} = require('telegraf');
const axios = require("axios");
const cheerio = require("cheerio");
const request = require('request-promise');

/* Create the base function to be ran */
const insta = async () => {
    /* Here you replace the username with your actual instagram username that you want to check */
    const USERNAME = 'novafuturainvestimentos';
    const BASE_URL = `https://www.instagram.com/${USERNAME}/`;

    /* Send the request and get the html content */
    let response = await request(
        BASE_URL,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    );
    
    /* Initiate Cheerio with the response */
    let $ = cheerio.load(response);
    
    /* Get the proper script of the html page which contains the json */
    let script = $('script').eq(4).html();
    
    /* Traverse through the JSON of instagram response */
    let { entry_data: { ProfilePage : {[0] : { graphql : {user} }} } } = JSON.parse(/window\._sharedData = (.+);/g.exec(script)[1]);
    
    /* Output the data */
    //console.log(user);
    //console.log(JSON.stringify(user, null, '\t'));

	return user.edge_owner_to_timeline_media.edges
		.filter((value) => value.node.__typename == 'GraphImage'
			&& value.node.owner.username == 'novafuturainvestimentos'
			&& value.node.edge_media_to_caption.edges[0].node.text.startsWith('Novas recomendações semanais!'));
//		.forEach((value) => console.log(value.node.__typename));

//    debugger;
}

const fetchData = async () => {
	const siteUrl = "https://www.novafutura.com.br/acoes-recomendacoes/";

	const result = await axios.get(siteUrl);

	return cheerio.load(result.data);
};

const extractData = async () => {
	const $ = await fetchData();
	const imageObject = $('.container > .row > .col-12 > .row > .col-12 > p > img');

	return imageObject;
}

//extractData();
/**/

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	console.log(ctx.update);
	ctx.reply('Seja bem vindo!\nEu ainda estou em desenvolvimento. Mas você pode enviar os comandos /carteiramensal e /carteirasemanal que eu respondo.');
});

bot.help((ctx) => {
	console.log(ctx.update);
	ctx.reply('Solicite as carteiras da Nova Fututra através dos comandos /carteiramensal e /carteirasemanal');
});

bot.command('carteiramensal', async (ctx) => {
	console.log(ctx.update);
	const imageObject = await extractData();
	const textObject = imageObject.parent().parent();

	ctx.reply(textObject.text());
	ctx.replyWithPhoto(imageObject.attr('src'));
});

bot.command('carteirasemanal', async (ctx) => {
	console.log(ctx.update);
	const imagePosts = await insta();
	const caption = imagePosts[0].node.edge_media_to_caption.edges[0].node.text;
	const urlImage = imagePosts[0].node.display_url;
	const cutPosition = caption.indexOf('#invistaemvoce');

	ctx.reply(caption.substring(0, cutPosition));
	ctx.replyWithPhoto(urlImage);
	ctx.reply(caption.substring(cutPosition));
});

bot.command('notify', (ctx) => {
	console.log(ctx.update);
	ctx.reply('Em desenvolvimento... Aguarde!');
});

bot.command('sugestion', (ctx) => {
	console.log(ctx.update);
	ctx.reply('Em desenvolvimento... Aguarde!');
});

bot.command('bug', (ctx) => {
	console.log(ctx.update);
	ctx.reply('Em desenvolvimento... Aguarde!');
});

bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.hears('oi', async (ctx) => {
	console.log(ctx.update);

	ctx.getChat(ctx.update.message.chat.id).then((value) => console.log(value));

	ctx.reply('Eu só sei responder aos comandos /carteiramensal e /carteirasemanal');

	/*const imageObject = await extractData();
	const textObject = imageObject.parent().parent();

	ctx.reply(textObject.text());
	ctx.replyWithPhoto(imageObject.attr('src'));

	ctx.reply('funcionou?');*/
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

/*setTimeout((chatId) => {
	
}, 10000, 847486984);*/

bot.startWebhook('/secret-path', null, 5000);
bot.launch();