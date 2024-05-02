import LiteTierlist from "@/types/LiteTierlist";
import State from "@/types/State";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import AuthenticationService from "@/services/AuthenticationService";
import Settings from "@/Settings";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {firestore} from "@/config/firebaseConfig";
import Tierlist from "@/types/dbmodel/Tierlist";

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


        try {
            if (AppController.INITIAL_INIT_DONE) return;

            if (Settings.PRODUCTION) {
                console.log("Running in production mode 🚀")
            } else {
                console.log("Running in development mode 🛠")
            }


            await AuthenticationService.init()

            const q = query(collection(firestore, "tierlists"), where("public", "==", true))
            const snapshot = await getDocs(q)
            const tierlists: LiteTierlist[] = snapshot.docs.map(doc => {
                const tl = doc.data() as Tierlist
                return {
                    id: tl.id,
                    name: tl.name,
                }
            })

            this.states.searchTierlistsState.set(tierlists)
            this.states.initDoneState.set(true)
        } catch (e) {
            toast.error(Texts.API_REQUEST_FAILED)
        }


    }

    cookieConsentAccepted = () => {
        localStorage.setItem("cookieConsentAccepted", "true")
        window.location.reload()
    }

    cookieConsentDeclined = () => {
        localStorage.setItem("cookieConsentAccepted", "false")

        toast.error(Texts.COOKIE_CONSENT_FORCE, {
            action: {
                label: Texts.ACCEPT,
                onClick: () => {
                    this.cookieConsentAccepted()
                }
            }
        })
    }


}
