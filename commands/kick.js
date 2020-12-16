module.exports = {
    name: 'kick',
    description: 'Kick!',
    guildOnly: true,
    execute(message) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to kick them!');
        }
        const taggedUser = message.mentions.users.first();
        taggedUser.kick();
        message.channel.send(`${taggedUser} has been kicked.`);
    },
};