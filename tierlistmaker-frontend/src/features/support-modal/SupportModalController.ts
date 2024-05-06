import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";

interface SupportModalControllerOptions extends ModalControllerOptions {
}


export default class SupportModalController extends ModalController<SupportModalControllerOptions> {

    constructor(options: SupportModalControllerOptions) {
        super(options);
    }

    open = () => {
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        this.states.showState.set(false)
    }
}