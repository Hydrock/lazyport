import blessed from 'blessed';

// Создание экрана
const screen = blessed.screen({
    smartCSR: true,
    title: 'Lazyport',
});

// Список
const list = blessed.list({
    parent: screen,
    label: ' Список процессов ',
    width: '50%',
    height: '50%',
    top: 'center',
    left: 'center',
    border: 'line',
    keys: true,
    vi: true,
    mouse: true,
    style: {
        selected: {
            bg: 'blue',
            fg: 'white',
        },
        item: {
            hover: {
                bg: 'green',
            },
        },
    },
    items: ['Процесс 1', 'Процесс 2', 'Процесс 3'],
});

// Инфо-панель
const message = blessed.box({
    parent: screen,
    bottom: 0,
    height: 3,
    width: '100%',
    tags: true,
    style: {
        fg: 'white',
        bg: 'gray',
    },
    content: 'Нажмите Enter для выбора, Q — выход.',
});

list.focus();

// Обработка нажатий
list.on('select', (item, index) => {
    message.setContent(`Вы выбрали: ${item.getText()}`);
    screen.render();
});

screen.key(['q', 'C-c'], () => process.exit(0));

screen.render();
