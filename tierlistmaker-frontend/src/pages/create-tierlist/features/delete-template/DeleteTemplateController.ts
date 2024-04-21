import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import ApiService from "@/services/ApiService";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import Paths from "@/Paths";
import {NavigateFunction} from "react-router-dom";

interface DeleteTemplateControllerOptions extends ModalControllerOptions {
    controller: CreateTierlistController
    navigate: NavigateFunction
}

export default class DeleteTemplateController extends ModalController<DeleteTemplateControllerOptions> {

    controller: CreateTierlistController;
    navigate: NavigateFunction;

    constructor(options: DeleteTemplateControllerOptions) {
        super(options);
        this.controller = options.controller;
        this.navigate = options.navigate;
    }

    public open =() => {
        this.states.showState.set(true);
    }

    public close =() => {
        this.states.showState.set(false);

    }

    public submit = () => {
        const tierlist = this.controller.states.tierlistState.val!
        console.log(tierlist)

        const promise = ApiService.deleteTemplate(tierlist.id)

        toast.promise(promise, {
            loading: Texts.DELETING_TEMPLATE,
            error: Texts.FAILED_TO_DELETE_TEMPLATE,
            success: () => {

                setTimeout(() => {
                    this.navigate(Paths.HOME)
                }, 500)

                return Texts.TEMPLATE_DELETED
            }
        })
    }


}