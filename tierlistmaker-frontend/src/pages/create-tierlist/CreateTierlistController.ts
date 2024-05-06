import State from "@/types/State";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import ApiService from "@/services/ApiService";
import Paths from "@/Paths";

import * as htmlToImage from 'html-to-image';
import {toast} from "sonner";
import Texts from "@/text/Texts";
import AuthenticationService from "@/services/AuthenticationService";
import {NavigateFunction} from "react-router-dom";
import {collection, doc, getDoc, getDocs, where, query, getCountFromServer} from "@firebase/firestore";
import {firestore} from "@/config/firebaseConfig";
import {wait} from "@/utils";


export interface CreateTierlistControllerOptions {
    states: {
        initDoneState: State<boolean>
        tierlistState: State<Tierlist | null>
        tierlistRowsState: State<TierlistRow[]>
        tierlistItemsState: State<TierlistItem[]>
        tierlistDataState: State<(TierlistItem & { rowId: string })[] | null>
        isTierlistVotedState: State<boolean>
        isLoadingState: State<boolean>
        tierlistVotesState: State<number>
        isExportingState: State<boolean>
        showImagesNamesState: State<boolean>
        showImageNamesModalState: State<boolean>
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


        let tierlist: Tierlist
        let tierlistRows: TierlistRow[]
        let tierlistItems: TierlistItem[]
        let votes: number

        try {
            const tierlistDoc = await getDoc(doc(firestore, "tierlists", tierlistId))
            tierlist = tierlistDoc.data() as Tierlist
            if (!tierlist) return this.navigate(Paths.NOT_FOUND)
            if (!tierlist.public) return this.navigate(Paths.NOT_FOUND)

        } catch (e) {
            console.log("ERROR: ", e)
            return this.navigate(Paths.NOT_FOUND)
        }


        try {
            const q = query(collection(firestore, "tierlistRows"), where("tierlistId", "==", tierlistId))
            const snapshot = await getDocs(q)
            tierlistRows = snapshot.docs.map(doc => doc.data() as TierlistRow)


        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }


        try {
            const q = query(collection(firestore, "tierlistItems"), where("tierlistId", "==", tierlistId))
            const snapshot = await getDocs(q)
            tierlistItems = snapshot.docs.map(doc => doc.data() as TierlistItem)
        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }


        try {
            const q = query(collection(firestore, "votes"), where("tierlistId", "==", tierlistId))
            const snapshot = await getCountFromServer(q)
            votes = snapshot.data().count
        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }


        try {
            const client = AuthenticationService.current
            if (client) {
                const q = query(collection(firestore, "votes"), where("tierlistId", "==", tierlistId), where("clientId", "==", client.id))
                const snapshot = await getCountFromServer(q)
                const count = snapshot.data().count
                this.states.isTierlistVotedState.set(count > 0)
            }
        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }


        this.states.tierlistState.set(tierlist)
        this.states.tierlistRowsState.set(tierlistRows)
        this.states.tierlistItemsState.set(tierlistItems)
        this.states.tierlistVotesState.set(votes)

        if (tierlist.showImageNames) {
            const localStorageShowImageNames = localStorage.getItem("showImageNames")

            if (!localStorageShowImageNames ) {
                this.states.showImageNamesModalState.set(true)
            } else {
                this.states.showImagesNamesState.set(
                    localStorageShowImageNames === "true"
                )
            }
        }


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


    async getExportImage(): Promise<string | never> {
        const el = document.getElementById("tierlist")
        if (!el) throw new Error("Tierlist not found in CreateTierlistController::getExportImage()")
        this.states.isExportingState.set(true)
        await wait(500)
        const dataUrl = await htmlToImage.toPng(el)
        this.states.isExportingState.set(false)
        return dataUrl
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
                    onClick: () => this.navigate(Paths.SIGN_IN + "?redirect=" + window.location.pathname)
                }
            })

        }

        if (this.states.isTierlistVotedState.val) {
            this.unvoteTierlist(tierlist)
        } else {
            this.voteTierlist(tierlist)
        }

    }

    onShareTwitter = () => {
        const BASE_URL = "https://twitter.com/intent/post?text="
        const text = encodeURIComponent(
            Texts.SHARE_TIERLIST_TEXT
                .replace("{name}", this.states.tierlistState.val!.name)
                .replace("{url}", window.location.href)
        )

        window.open(`${BASE_URL}${text}`)
    }

    onShareReddit = () => {
        const BASE_URL = "https://www.reddit.com/submit?title="
        const text = encodeURIComponent(
            Texts.SHARE_TIERLIST_TEXT
                .replace("{name}", this.states.tierlistState.val!.name)
                .replace("{url}", window.location.href)
        )

        window.open(`${BASE_URL}${text}`)
    }

    getEncodedShareTierlistData = () => {
        const data = this.states.tierlistDataState.val!


        if (!data) return

        const dataMap: Record<string, string[]> = {}

        data.forEach(item => {
            if (!dataMap[item.rowId]) {
                dataMap[item.rowId] = []
            }
            dataMap[item.rowId].push(item.id)
        })

        const dataString = Object.keys(dataMap).map(rowId => `${rowId}${dataMap[rowId].map(id => id.slice(0, 4)).join("")};`).join(";")

        return btoa(dataString)

    }

    getShareRankingUrl = () => {
        const data = this.getEncodedShareTierlistData()
        if (!data) return ""
        const id = AuthenticationService.current!.id

        return `${window.location.href.replace("create", "shared")}?data=${data}&createdBy=${encodeURIComponent(id)}`
    }

    resetTierlist = () => {
        const tierlistData = this.states.tierlistDataState.val
        if (!tierlistData) return
        const tierlistItems = this.states.tierlistItemsState.val
        if (!tierlistItems) return

        const newTierlistData = tierlistItems.map(item => ({...item, rowId: "default"}))

        this.states.tierlistDataState.set(newTierlistData)
    }


}