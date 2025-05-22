import blessed from 'blessed';
import { getPorts, PortProcess } from './ports';

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
    content: 'Нажмите Q для выхода.',
});

list.focus();

async function updateList() {
    try {
        const ports: PortProcess[] = await getPorts();
        list.setItems(
            ports.map(p => `:${p.port}  PID: ${p.pid}  ${p.name}`)
        );
        screen.render();
    } catch (err) {
        list.setItems(['Ошибка при получении портов']);
        screen.render();
    }
}

// Обновлять список каждые 3 секунды
updateList();
setInterval(updateList, 3000);

screen.key(['q', 'C-c'], () => process.exit(0));
