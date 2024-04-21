import LiteTierlist from "@/types/LiteTierlist";
import State from "@/types/State";
import ApiService from "@/services/ApiService";
import {toast} from "sonner";
import Texts from "@/text/Texts";

import AuthenticationService from "@/services/AuthenticationService";
import {NavigateFunction} from "react-router-dom";
import Paths from "@/Paths";


interface ProfilePageControllerOptions {
    states: {
        clientTemplatesState: State<LiteTierlist[]>
        initDoneState: State<boolean>
    },
    navigate: NavigateFunction
}

export default class ProfilePageController {
    private readonly states: ProfilePageControllerOptions["states"]
    private readonly navigate: ProfilePageControllerOptions["navigate"]

    constructor(options: ProfilePageControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
    }

    public async init() {

        if (!AuthenticationService.current) return this.navigate(Paths.SIGN_IN)

        const {success, templates} = await ApiService.loadClientTemplates()

        if (!success) {
            return toast.error(Texts.API_REQUEST_FAILED)
        }

        this.states.clientTemplatesState.set(templates)
        this.states.initDoneState.set(true)
    }
}