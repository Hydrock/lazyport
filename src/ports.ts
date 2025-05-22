import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export interface PortProcess {
    port: string;
    pid: string;
    name: string;
}

export async function getPorts(): Promise<PortProcess[]> {
    const { stdout } = await execAsync('lsof -nP -iTCP -sTCP:LISTEN');
    const lines = stdout.split('\n').filter(Boolean);
    lines.shift(); // убрать заголовок

    const results: PortProcess[] = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const name = parts[0]; // имя процесса
        const pid = parts[1];  // PID
        const portInfo = parts[8]; // *:5000
        const port = portInfo.includes(':') ? portInfo.split(':').pop()! : '?';
        return { port, pid, name };
    });

    return results;
}
