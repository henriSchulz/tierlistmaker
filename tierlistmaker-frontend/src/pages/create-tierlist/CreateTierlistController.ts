import State from "@/types/State";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import ApiService from "@/services/ApiService";
import Paths from "@/Paths";
import Settings from "@/Settings";
import html2canvas from "html2canvas";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import AuthenticationService from "@/services/AuthenticationService";
import {NavigateFunction} from "react-router-dom";


interface CreateTierlistControllerOptions {
    states: {
        initDoneState: State<boolean>
        tierlistState: State<Tierlist | null>
        tierlistRowsState: State<TierlistRow[]>
        tierlistItemsState: State<TierlistItem[]>
        tierlistDataState: State<(TierlistItem & { rowId: string })[] | null>
        isTierlistVotedState: State<boolean>
        isLoadingState: State<boolean>
        tierlistVotesState: State<number>
    },
    navigate: NavigateFunction
}


export default class CreateTierlistController {


    states: CreateTierlistControllerOptions["states"]
    navigate: NavigateFunction


    constructor(options: CreateTierlistControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
    }


    async init(id?: string) {

        if (!id) {
            console.log("Navigating back bc id is null")
            return this.navigate(Paths.NOT_FOUND)
        }

        const tierlistId = id.split("-").pop()

        if (!tierlistId) {
            console.log("Navigating back bc tierlistId is null")
            return this.navigate(Paths.NOT_FOUND)
        }

        const {success: success_, data} = await ApiService.loadTierlist(tierlistId)

        if (!success_ || !data) {
            console.log("Navigating back bc success_ is false or data is null")
            return this.navigate(Paths.NOT_FOUND)
        }

        const {success, voted} = await ApiService.loadIsTierlistVoted(tierlistId)

        if (success) {
            this.states.isTierlistVotedState.set(voted)
        }

        const {tierlist, tierlistRows, tierlistItems, votes} = data

        this.states.tierlistState.set(tierlist)
        this.states.tierlistRowsState.set(tierlistRows)
        this.states.tierlistItemsState.set(tierlistItems)
        this.states.tierlistVotesState.set(votes)

        if (localStorage.getItem(tierlistId)) {
            this.loadTierlistLocal(tierlist, tierlistItems)
        } else {
            const tierlistData: (TierlistItem & { rowId: string })[] = tierlistItems.map(item => ({
                ...item,
                rowId: "default"
            }))
            this.states.tierlistDataState.set(tierlistData)
        }


        this.states.initDoneState.set(true)
    }

    getTierlistItemImageUrl(tierlistId: string, itemId: string) {
        return `${Settings.API_URL}/template-item-image/${tierlistId}/${itemId}`
    }

    async export() {
        const el = document.getElementById("tierlist")
        if (!el) return

        const backgroundBefore = el.style.backgroundColor
        const paddingBefore = el.style.padding
        el.style.backgroundColor = "white"
        el.style.padding = "20px"

        const canvas = await html2canvas(el, {useCORS: true})

        const img = canvas.toDataURL("image/png")

        const a = document.createElement("a")
        a.href = img
        a.download = "tierlist.png"
        a.click()

        el.style.backgroundColor = backgroundBefore
        el.style.padding = paddingBefore

    }


    saveTierlistLocal() {

        const data = this.states.tierlistDataState.val

        if (!data) return
        if (!this.states.tierlistState.val) return

        const dataMap: Record<string, string[]> = {}

        data.forEach(item => {
            if (!dataMap[item.rowId]) {
                dataMap[item.rowId] = []
            }
            dataMap[item.rowId].push(item.id)
        })

        const dataString = JSON.stringify(dataMap)

        localStorage.setItem(this.states.tierlistState.val?.id, dataString)
    }

    loadTierlistLocal(tierlist: Tierlist, tierlistItems: TierlistItem[]) {

        const dataString = localStorage.getItem(tierlist.id)

        if (!dataString) return

        const dataMap = JSON.parse(dataString) as Record<string, string[]>

        const tierlistData: (TierlistItem & { rowId: string })[] = []

        Object.keys(dataMap).forEach(rowId => {
            dataMap[rowId].forEach(itemId => {
                const item = tierlistItems.find(item => item.id === itemId)
                if (item) {
                    tierlistData.push({...item, rowId})
                }
            })
        })


        for (const item of tierlistItems) {
            const isItemInDataMap = Object.values(dataMap).flat().includes(item.id);
            if (!isItemInDataMap) {
                tierlistData.push({...item, rowId: "default"});
            }
        }

        this.states.tierlistDataState.set(tierlistData)
    }


    unvoteTierlist = (tierlist: Tierlist) => {
        this.states.tierlistVotesState.set(this.states.tierlistVotesState.val - 1)
        this.states.isTierlistVotedState.set(false)
        ApiService.unvoteTierlist(tierlist.id).then(({success}) => {
            if (!success) {
                this.states.tierlistVotesState.set(this.states.tierlistVotesState.val + 1)
                this.states.isTierlistVotedState.set(true)
                toast.error(Texts.UNVOTING_TIERLIST_FAILED)
            }
        })


    }

    voteTierlist = (tierlist: Tierlist) => {

        this.states.tierlistVotesState.set(this.states.tierlistVotesState.val + 1)
        this.states.isTierlistVotedState.set(true)
        ApiService.voteTierlist(tierlist.id).then(({success}) => {
            if (!success) {
                this.states.tierlistVotesState.set(this.states.tierlistVotesState.val - 1)
                this.states.isTierlistVotedState.set(false)
                toast.error(Texts.VOTING_TIERLIST_FAILED)
            }
        })

    }


    toggleVoteTierlist = () => {


        const tierlist = this.states.tierlistState.val
        if (!tierlist) return

        if (!AuthenticationService.current) {
            return toast.error(Texts.NEED_TO_BE_SIGNED_IN_TO_VOTE, {
                action: {
                    label: Texts.SIGN_IN,
                    onClick: () => this.navigate(Paths.SIGN_IN)
                }
            })

        }

        if (this.states.isTierlistVotedState.val) {
            this.unvoteTierlist(tierlist)
        } else {
            this.voteTierlist(tierlist)
        }

    }


}