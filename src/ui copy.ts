import blessed from 'blessed';
// import { getPortsAndProcesses } from './ports';
// import { killProcess } from './kill';

export async function runUI() {
    const screen = blessed.screen({ smartCSR: true, title: 'Lazyport' });

    const list = blessed.list({
        parent: screen,
        width: '100%',
        height: '100%',
        keys: true,
        vi: true,
        mouse: true,
        style: {
            selected: { bg: 'red' },
        },
    }) as blessed.Widgets.ListElement;

    // let data = await getPortsAndProcesses();
    // list.setItems(data.map(p => `:${p.port} | ${p.name} (${p.pid})`));
    // screen.render();

    list.focus();

    // list.on('keypress', async (_, key) => {
    //     if (key.name === 'k') {
    //         // eslint-disable-next-line
    //         // @ts-ignore
    //         const index = list.selected ?? 0;
    //         const pid = data[index]?.pid;
    //         if (pid) {
    //             await killProcess(pid);

    //             // Обновим данные
    //             data = await getPortsAndProcesses();
    //             list.setItems(data.map(p => `:${p.port} | ${p.name} (${p.pid})`));
    //             screen.render();
    //         }
    //     }
    // });

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

