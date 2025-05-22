const os = require('os');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function getPorts() {
    if (os.platform() === 'win32') {
        return await getPortsWindows();
    } else {
        return await getPortsUnix();
    }
}

async function getPortsUnix() {
    const { stdout } = await execAsync('lsof -nP -iTCP -sTCP:LISTEN');
    const lines = stdout.split('\n').filter(Boolean);
    lines.shift();

    return lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const name = parts[0];
        const pid = parts[1];
        const portInfo = parts[8];
        const port = portInfo.includes(':') ? portInfo.split(':').pop() : '?';
        return { port, pid, name };
    });
}

async function getPortsWindows() {
    const { stdout } = await execAsync('netstat -ano -p tcp');
    const lines = stdout.split('\n').filter(l => l.includes('LISTENING'));

    const ports = await Promise.all(lines.map(async (line) => {
        const parts = line.trim().split(/\s+/);
        const localAddress = parts[1];
        const pid = parts[4];
        const port = localAddress.includes(':') ? localAddress.split(':').pop() : '?';
        const name = await getProcessNameByPid(pid);

        return { port, pid, name };
    }));

    return ports;
}

async function getProcessNameByPid(pid) {
    try {
        const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}"`);
        const lines = stdout.split('\n');
        if (lines.length > 3) {
            const line = lines[3];
            const name = line.trim().split(/\s+/)[0];
            return name;
        }
        return 'Unknown';
    } catch {
        return 'Unknown';
    }
}

module.exports = { getPorts };
