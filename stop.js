module.exports = {
    name: 'stop',
    description: 'stops',
    execute(message) {
        message.channel.send('Stopped.');
    },
};