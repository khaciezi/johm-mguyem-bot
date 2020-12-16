module.exports = {
    name: 'disconnect',
    aliases: ['dc', 'leave'],
    description: 'disconnects',
    execute(message) {
        message.channel.send('Disconnected.');
    },
};