import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import AuthenticationService from "@/services/AuthenticationService";

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
            this.controller.states.showSignInSheetState.set(true)
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