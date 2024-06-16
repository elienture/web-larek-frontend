import {Component} from "./base/component";
import {ensureElement} from "../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container)


        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    set total(value: string) {
        this.setText(this._total, `Списано ${value} синапсов`)
      }
}
