import State from "@/types/State";
import LiteTierlist from "@/types/LiteTierlist";
import ApiService from "@/services/ApiService";
import {toast} from "sonner";
import Texts from "@/text/Texts";

interface HomePageControllerOptions {
    states: {
        mostVotedTierlistsState: State<LiteTierlist[]>
        mostVotedSportsTierlistsState: State<LiteTierlist[]>
        mostVotedVideoGamesTierlistsState: State<LiteTierlist[]>
        initDoneState: State<boolean>
    }
}

export default class HomePageController {

    private states: HomePageControllerOptions["states"]

    constructor(options: HomePageControllerOptions) {
        this.states = options.states
    }

    init = async () => {
        const {success, tierlists} = await ApiService.loadMostVotedTierlists()
        const {success: successSports, tierlists: sportsTierlists} = await ApiService.loadMostVotedTierlistsByCategory("SPORTS")
        const {success: successVideoGames, tierlists: videoGamesTierlists} = await ApiService.loadMostVotedTierlistsByCategory("VIDEO_GAMES")

        if (success && successSports && successVideoGames) {
            this.states.mostVotedTierlistsState.set(tierlists)
            this.states.mostVotedSportsTierlistsState.set(sportsTierlists)
            this.states.mostVotedVideoGamesTierlistsState.set(videoGamesTierlists)
            this.states.initDoneState.set(true)
        } else {
            toast.error(Texts.API_REQUEST_FAILED)
        }
    }


}