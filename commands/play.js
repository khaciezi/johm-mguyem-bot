module.exports = {
    name: 'play',
    description: 'plays',
    args: true,
    execute(message, args) {
        if (message.member.voice.channel) {
            if (!args.length) {
                return message.channel.send(`You didn't provide any links, ${message.author}!`);
            }
        }
        else {
            return message.channel.send(`You need to be in a voice channel to play music, ${message.author}!`);
        }
        message.channel.send(`This is not a valid link: ${args}`);
    },
};