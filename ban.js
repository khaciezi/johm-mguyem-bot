module.exports = {
    name: 'ban',
    description: 'Ban!',
    guildOnly: true,
    execute(message) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to ban them!');
        }
        const taggedUser = message.mentions.users.first();
        taggedUser.ban();
        message.channel.send(`${taggedUser} has been banned.`);
    },
};