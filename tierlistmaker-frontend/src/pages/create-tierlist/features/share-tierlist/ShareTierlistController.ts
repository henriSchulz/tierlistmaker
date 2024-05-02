import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import AuthenticationService from "@/services/AuthenticationService";
import Paths from "@/Paths";

interface ShareTierlistControllerOptions extends ModalControllerOptions {
    controller: CreateTierlistController
}

export default class ShareTierlistController extends ModalController<ShareTierlistControllerOptions> {
    controller: CreateTierlistController

    constructor(options: ShareTierlistControllerOptions) {
        super(options)
        this.controller = options.controller
    }

    open = () => {

        if (!AuthenticationService.current) {
            this.controller.navigate(Paths.SIGN_IN + "?redirect=" + window.location.pathname)
        }

        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        this.close()
    }

}