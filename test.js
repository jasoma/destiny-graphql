const destinyql = require('.');

destinyql(`
{
    player(username: "strombane", platform: PSN) {
        id
        username
        platform
        grimoireScore
        characters {
            id
            class
            stats {
                armor
                recovery
                agility
                intellect
                discipline
                strength
            }
            race
            gender
            level
            light
            playTime
            equipment {
                id
                ref
                type
                name
                description
                iconPath
            }
        }
    }
}`).then(r => console.log(JSON.stringify(r, null, 2)));
