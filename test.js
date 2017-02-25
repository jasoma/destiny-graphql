const destinyql = require('.');

destinyql(`
{
    player(username: "strombane", platform: PSN) {
        id
        username
        platform
        grimoireScore
    }
}`).then(r => console.log(JSON.stringify(r, null, 2)));
