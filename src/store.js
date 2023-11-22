/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = []; // Слушатели изменений состояния
    this.lastCode = 7; // Переменная для хранения последнего сгенерированного кода записи
    this.selectionCount = {}; // Счетчик выделений

    this.state.list.forEach(item => {
      this.selectionCount[item.code] = 0; // Инициализация каждого пункта 0
    })
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const nextCode = this.getNextCode();

    this.setState({
      ...this.state,
      list: [...this.state.list, {code: nextCode, title: 'Новая запись'}]
    })
  };

  /**
   * Получаем номер последней записи
   * */
  getNextCode() {
    let nextCode = this.lastCode + 1;

    while(this.state.list.some(item => item.code === nextCode)) {
      nextCode++;
    }

    this.lastCode = nextCode;
    return nextCode;
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code)
    })
  };

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        if (item.code === code) {
          item.selected = !item.selected;

          // Увеличение счетчика
          if(item.selected) {
            this.selectionCount = this.selectionCount || {};
            this.selectionCount[code] = (this.selectionCount[code] || 0) + 1;
          }
        } else {
          item.selected = false; // Сброс выделения
        }
        return item;
      })
    })
  };
}

export default Store;
