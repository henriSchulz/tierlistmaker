import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";

interface MessageModalControllerOptions extends ModalControllerOptions {
    onSubmit?: () => void
    onCancel?: () => void
}


export default class MessageModalController extends ModalController<MessageModalControllerOptions> {

    onSubmit?: () => void
    onCancel?: () => void

    constructor(options: MessageModalControllerOptions) {
        super(options);
        this.onSubmit = options.onSubmit
        this.onCancel = options.onCancel
    }

    open = () => {
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
        if (this.onCancel) {
            this.onCancel()
        }
    }

    submit = () => {
        this.states.showState.set(false)
        if (this.onSubmit) {
            this.onSubmit()
        }
    }
}

