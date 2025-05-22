const kill = require('tree-kill');

function killProcess(pid) {
    return new Promise((resolve, reject) => {
        kill(parseInt(pid), 'SIGKILL', (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { killProcess };
