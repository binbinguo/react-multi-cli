const entryBuild = require('../entry/entry');
let entry = {};
entryBuild.map((data) => {
    entry[data.name] = ['./entry/' + data.name + '.js', data.title];
});
module.exports = entry;