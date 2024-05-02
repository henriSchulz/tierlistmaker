import State from "@/types/State";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {NavigateFunction} from "react-router-dom";
import Paths from "@/Paths";
import {collection, doc, getDoc, getDocs, query, where} from "@firebase/firestore";
import {firestore} from "@/config/firebaseConfig";
import ApiService from "@/services/ApiService";


export interface SharedTierlistControllerOptions {
    navigate: NavigateFunction
    searchParams: URLSearchParams
    states: {
        initDoneState: State<boolean>
        tierlistState: State<Tierlist | null>
        tierlistRowsState: State<TierlistRow[]>
        tierlistItemsState: State<TierlistItem[]>
        tierlistDataState: State<(TierlistItem & { rowId: string })[] | null>
        createdByState: State<string>
    }
}

export default class SharedTierlistController {
    states: SharedTierlistControllerOptions["states"]
    navigate: NavigateFunction
    searchParams: URLSearchParams

    constructor(options: SharedTierlistControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
        this.searchParams = options.searchParams
    }

    init = async (id?: string) => {
        if (!id) {
            console.log("Navigating back bc id is null")
            return this.navigate(Paths.NOT_FOUND)
        }

        const tierlistId = id.split("-").pop()

        if (!tierlistId) {
            console.log("Navigating back bc tierlistId is null")
            return this.navigate(Paths.NOT_FOUND)
        }

        let data = this.searchParams.get("data")

        if (!data) return this.navigate(Paths.NOT_FOUND)

        try {
            data = atob(data)
        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }

        const uid = this.searchParams.get("createdBy")

        if (!uid) return this.navigate(Paths.NOT_FOUND)

        const {success, profile} = await ApiService.getClientProfile(uid)

        if (!success) return this.navigate(Paths.NOT_FOUND)


        this.states.createdByState.set(profile.name)

        let tierlist: Tierlist
        let tierlistRows: TierlistRow[]
        let tierlistItems: TierlistItem[]


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

        this.states.tierlistState.set(tierlist)
        this.states.tierlistRowsState.set(tierlistRows)
        this.states.tierlistItemsState.set(tierlistItems)

        const tierlistData = [] as (TierlistItem & { rowId: string })[]
        const splitData = data.split(";")

        try {
            for (const row of splitData) {
                const {rowId, itemIds} = this.parseRow(row) //each itemId is the first 4 characters of the actual itemId
                for (const itemId of itemIds) {
                    const item = tierlistItems.find(item => item.id.slice(0, 4) === itemId)
                    if (item) {
                        const row = tierlistRows.find(row => row.id.slice(0, 4) === rowId)
                        if (row) {
                            tierlistData.push({...item, rowId: row.id})
                        }
                    }
                }
            }
        } catch (e) {
            return this.navigate(Paths.NOT_FOUND)
        }

        console.log("tierlistData: ", tierlistData)
        this.states.tierlistDataState.set(tierlistData)
        this.states.initDoneState.set(true)


    }

    parseRow = (row: string) => {
        const [rowId, ...itemIds] = row.split("").reduce((acc, curr, i) => {
            if (i % 4 === 0) {
                acc.push(curr)
            } else {
                acc[acc.length - 1] += curr
            }
            return acc
        }, [] as string[])

        return {rowId, itemIds}
    }

}