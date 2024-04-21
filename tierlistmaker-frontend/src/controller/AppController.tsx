import LiteTierlist from "@/types/LiteTierlist";
import State from "@/types/State";
import ApiService from "@/services/ApiService";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import AuthenticationService from "@/services/AuthenticationService";
import Settings from "@/Settings";

interface AppControllerOptions {
    states: {
        initDoneState: State<boolean>
        searchTierlistsState: State<LiteTierlist[]>
    }
}

export default class AppController {

    public static INITIAL_INIT_DONE = false;


    public states: AppControllerOptions["states"]

    constructor(options: AppControllerOptions) {
        this.states = options.states
    }


    async init() {


        if (AppController.INITIAL_INIT_DONE) return;

        if (Settings.PRODUCTION) {
            console.log("Running in production mode 🚀")
        } else {
            console.log("Running in development mode 🛠")
        }


        await AuthenticationService.init()

        const {success, tierlists} = await ApiService.loadSearchTierlists()


        if (success) {
            this.states.searchTierlistsState.set(tierlists)
            this.states.initDoneState.set(true)
            AppController.INITIAL_INIT_DONE = true
        } else {
            toast.error(Texts.API_REQUEST_FAILED)
        }


    }


}
