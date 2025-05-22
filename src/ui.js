const blessed = require('blessed');
const { getPorts } = require('./ports');
const { killProcess } = require('./kill');

const screen = blessed.screen({
    smartCSR: true,
    title: 'Lazyport',
});

const list = blessed.list({
    parent: screen,
    label: ' Занятые порты ',
    width: '80%',
    height: '80%',
    top: 'center',
    left: 'center',
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
        // list.setItems(data.map(p => `:${p.port}  PID: ${p.pid}  ${p.name}`));
        list.setItems(
            data.map(p => {
                const port = `:${p.port}`.padEnd(10);
                const pid = `PID: ${p.pid}`.padEnd(16);
                return `${port}${pid}${p.name}`;
            })
        );
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
