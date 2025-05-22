import find from 'find-process';

export async function getPortsAndProcesses() {
    const ports: { port: number; pid: number; name: string; cmd: string }[] = [];

    const start = 3000;
    const end = 9999;

    for (let port = start; port <= end; port++) {
        try {
            const result = await find('port', port);
            if (result.length) {
                ports.push({ port, ...result[0] });
            }
        } catch (e) { }
    }

    return ports;
}
