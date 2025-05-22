import kill from 'tree-kill';

export function killProcess(pid: number) {
    return new Promise<void>((resolve, reject) => {
        kill(pid, 'SIGKILL', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
