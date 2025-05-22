const blessed = require('blessed');
const { getPorts } = require('./ports');
const { killProcess } = require('./kill');

const screen = blessed.screen({
    smartCSR: true,
    title: 'Lazyport',
});

const headerBox = blessed.box({
    parent: screen,
    top: 0,
    left: 'center',
    height: 1,
    width: '80%',
    tags: true,
    content: `{bold}${'PORT'.padEnd(10)}${'PID'.padEnd(16)}NAME{/bold}`,
    style: {
        fg: 'white',
    }
});

const list = blessed.list({
    parent: screen,
    label: ' Занятые порты ',
    width: '100%',
    height: '80%',
    top: 1,
    left: 0,
    border: 'line',
    keys: true,
    vi: true,
    mouse: true,
    style: {
        selected: { bg: 'blue', fg: 'white' },
        item: { hover: { bg: 'green' } },
    },
    items: ['Загрузка...'],
});

const message = blessed.box({
    parent: screen,
    bottom: 0,
    height: 3,
    width: '100%',
    tags: true,
    style: { fg: 'white', bg: 'gray' },
    content: 'Нажмите K для завершения процесса. Q — выход.',
});

list.focus();

let data = [];

async function updateList() {
    try {
        data = await getPorts();

        const items = data.map(p => {
            const port = `:${p.port}`.padEnd(10);
            const pid = `${p.pid}`.padEnd(16);
            return `${port}${pid}${p.name}`;
        });

        list.setItems(items);
        screen.render();
    } catch (err) {
        list.setItems(['Ошибка при получении портов']);
        screen.render();
    }
}

updateList();
const interval = setInterval(updateList, 3000);

screen.key(['q', 'C-c'], () => {
    clearInterval(interval);
    screen.destroy();
    process.exit(0);
});

screen.key(['k', 'C-s'], async () => {
    const index = list.selected || 0;
    const item = data[index];
    if (!item) return;

    try {
        await killProcess(item.pid);
        message.setContent(`✔ Завершён PID ${item.pid} (${item.name})`);
    } catch (err) {
        message.setContent(`❌ Ошибка: ${err.message}`);
    }

    await updateList();
});
