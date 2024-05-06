import State from "@/types/State";
import LiteTierlist from "@/types/LiteTierlist";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import {collection, getDocs, limit, orderBy, query, where} from "@firebase/firestore";
import {firestore} from "@/config/firebaseConfig";
import Tierlist from "@/types/dbmodel/Tierlist";
import Vote from "@/types/dbmodel/Vote";

interface HomePageControllerOptions {
    states: {
        mostVotedTierlistsState: State<LiteTierlist[]>
        mostVotedSportsTierlistsState: State<LiteTierlist[]>
        mostVotedVideoGamesTierlistsState: State<LiteTierlist[]>
        recentlyCreatedTierlistsState: State<LiteTierlist[]>
        initDoneState: State<boolean>
    }
}

export default class HomePageController {

    private states: HomePageControllerOptions["states"]

    constructor(options: HomePageControllerOptions) {
        this.states = options.states
    }

    loadMostVotedTierlists = async (tierlists: Tierlist[], votes: Vote[]): Promise<LiteTierlist[]> => {
        const tierlistVotes: Record<string, number> = {}

        for (const tierlist of tierlists) {
            tierlistVotes[tierlist.id] = votes.filter(vote => vote.tierlistId === tierlist.id).length
        }

        const sortedTierlistVotes = Object.entries(tierlistVotes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

        return sortedTierlistVotes.map(([tierlistId]) => ({
            id: tierlistId,
            name: tierlists.find(tierlist => tierlist.id === tierlistId)!.name
        }))
    }


    loadRecentlyCreatedTierlists = async (): Promise<LiteTierlist[]> => {
        try {
            const tierlistsSnapshot = await getDocs(
                query(collection(firestore, "tierlists"),
                    where("public", "==", true),
                    orderBy("createdAt", "desc"),
                    limit(5)
                )
            )

            return tierlistsSnapshot.docs.map(doc => {
                const data = doc.data() as Tierlist
                return {
                    id: data.id,
                    name: data.name
                }
            })

        } catch (e) {
            toast.error(Texts.API_REQUEST_FAILED)
            console.log(e)
            return []

        }
    }

    init = async () => {


        try {
            const votesQuery = query(collection(firestore, "votes"))

            const votesSnapshot = await getDocs(votesQuery)

            const votes = votesSnapshot.docs.map(doc => doc.data() as Vote)

            const tierlistsSnapshot = await getDocs(
                query(collection(firestore, "tierlists"), where("public", "==", true))
            )

            const tierlists = tierlistsSnapshot.docs.map(doc => doc.data() as Tierlist)
            const mostVotedTierlists = await this.loadMostVotedTierlists(tierlists, votes)
            const mostVotedSportsTierlists = await this.loadMostVotedTierlists(tierlists.filter(tierlist => tierlist.categoryId === "SPORTS"), votes)
            const mostVotedVideoGamesTierlists = await this.loadMostVotedTierlists(tierlists.filter(tierlist => tierlist.categoryId === "VIDEO_GAMES"), votes)
            const recentlyCreatedTierlists = await this.loadRecentlyCreatedTierlists()

            this.states.mostVotedTierlistsState.set(mostVotedTierlists)
            this.states.mostVotedSportsTierlistsState.set(mostVotedSportsTierlists)
            this.states.mostVotedVideoGamesTierlistsState.set(mostVotedVideoGamesTierlists)
            this.states.recentlyCreatedTierlistsState.set(recentlyCreatedTierlists)
            this.states.initDoneState.set(true)

        } catch (e) {
            toast.error(Texts.API_REQUEST_FAILED)
        }


    }
}