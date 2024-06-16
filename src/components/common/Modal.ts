import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IModalData {
    content: HTMLElement;
}

/* Класс отображения модального окна */

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            container
        );
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    _toggleModal(state: boolean = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }
    // Обработчик в виде стрелочного метода, чтобы не терять контекст `this`
    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal(); // открываем
        // навешиваем обработчик при открытии
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false); // закрываем
   // правильно удаляем обработчик при закрытии
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
