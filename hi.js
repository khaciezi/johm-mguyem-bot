module.exports = {
    name: 'hi',
    description: 'Hi!',
    execute(message) {
        message.channel.send(`Hi, ${message.author.username}.`);
    },
};