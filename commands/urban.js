module.exports = {
    name: 'urban',
    description: 'urban!',
    args: true,
    execute(message, args) {
        if (!args.length) {
            return message.channel.send('You need to supply a search term!');
        }
    },
};
