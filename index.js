const { Client, MessageAttachment } = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
	if (commandName === 'bruh') {
		const attachment = new MessageAttachment('https://media1.tenor.com/images/8daeb547b121eef5f34e7d4e0b88ea35/tenor.gif?itemid=5156041');
		message.channel.send(`${message.author},`, attachment);
	}
	if (message.member.voice.channel && commandName === 'join') {
		const connection = await message.member.voice.channel.join();
	}
	if (commandName === 'play') {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			connection.play(ytdl(`${args[0]}`, { filter: 'audioonly' }));
			message.channel.send('Now playing.');
		}
	}
	if (commandName === 'stop') {
		const connection = await message.member.voice.channel.join();
		const dispatcher = connection.play(`${args[0]}`);
		dispatcher.pause();
	}
	if (commandName === 'disconnect' || commandName === 'dc' || commandName === 'leave') {
		const connection = await message.member.voice.channel.join();
		connection.disconnect();
	}
	if (commandName === 'react') {
		message.react('😄');
	}
	if (commandName === 'setup') {
		client.user.setUsername('Johm Mguyem');
		client.user.setAvatar('botpfp.jpg');
	}
	if (commandName === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	}
	if (commandName === 'dog') {
		const fetched = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
		message.channel.send(fetched.message);
	}
	if (commandName === 'urban') {
		let string = '';
		const query = querystring.stringify({ term: args.join(' ') });
		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}
		for (let i = 0; i < args.length; i++) {
			string += args[i] + ' ';
		}
		message.channel.send(`**${string}**`);
		message.channel.send(list[0].definition);
	}
});
client.login(token);
