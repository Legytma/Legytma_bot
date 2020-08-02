require('dotenv').config();

const {Telegraf} = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	console.log(ctx.update);
	ctx.reply('Seja bem vindo!\nEu ainda estou em desenvolvimento. Mas você pode enviar os comandos /carteiramensal e /carteirasemanal que eu respondo.');
});

bot.help((ctx) => {
	console.log(ctx.update);
	ctx.reply('Solicite as carteiras da Nova Fututra através dos comandos /carteiramensal e /carteirasemanal');
});

bot.command('carteiramensal', (ctx) => {
	console.log(ctx.update);
	ctx.reply('A carteira de Agosto ainda não saiu... Mas a carteira de Julho é essa:');
	ctx.replyWithPhoto('https://www.novafutura.com.br/wp-content/uploads/2020/07/Carteira-Recomendada-MENSAL-2020-PERCENTUAL-JULHO-768x682.png');
});

bot.command('carteirasemanal', (ctx) => {
	console.log(ctx.update);
	ctx.reply('A carteira da primeira semana de Agosto ainda não saiu... Mas a carteira da última semana de Julho é essa:');
	ctx.replyWithPhoto('https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.2885-15/e35/109840376_586555178673039_3484299458615277498_n.jpg?_nc_ht=instagram.fgyn3-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=KwsU9JCq4c0AX9YIUkj&oh=2fe4daa23dc00fd1d1c1359c3a297bcf&oe=5F4DF193');
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

bot.hears('oi', (ctx) => {
	console.log(ctx.update);

	ctx.getChat(ctx.update.message.chat.id).then((value) => console.log(value));

	ctx.reply('Eu só sei responder aos comandos /carteiramensal e /carteirasemanal');
});

bot.launch();