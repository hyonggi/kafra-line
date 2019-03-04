const firebase = require('./firebase');
const lineMessage = require('./line.message');
const Chance = require('chance')
const chance = new Chance();

module.exports = text => {
    return firebase.getAllChat()
    .then(answers => {
        let ans = answers.find(ans => RegExp(ans.match,'g').test(text));

        if(!ans) return null;

        if(ans.chance) {
            return (chance.bool({likelihood: ans.chance}))? chance.pickone(ans.answers) : null;
        }

        return chance.pickone(ans.answers);
    })
    .then(answer => {
        if(!answer) return null;
        
        switch(answer.type) {
            case 'text':
                return lineMessage.createTextMessage(answer.value);
            case 'image':
                return lineMessage.createImageMessage(answer.value, answer.value);
        }
    });
}