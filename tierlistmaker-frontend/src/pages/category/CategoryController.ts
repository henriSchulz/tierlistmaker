import State from "@/types/State";
import {NavigateFunction} from "react-router-dom";
import LiteTierlist from "@/types/LiteTierlist";
import Paths from "@/Paths";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {firestore} from "@/config/firebaseConfig";
import Texts from "@/text/Texts";

interface CategoryControllerOptions {
    states: {
        initDoneState: State<boolean>
        liteTierlistsState: State<LiteTierlist[]>
        nameState: State<string>
    },
    navigate: NavigateFunction
}

export default class CategoryController {
    states: CategoryControllerOptions['states']
    navigate: CategoryControllerOptions['navigate']

    constructor(options: CategoryControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate

    }

    init = async (id?: string) => {
        if (!id) {
            this.navigate(Paths.NOT_FOUND)
        }

        if(!Object.keys(Texts.SELECTION_CATEGORIES).includes(id!)) {
            this.navigate(Paths.NOT_FOUND)
        }

        const q = query(collection(firestore, 'tierlists'), where("public", "==", true), where('categoryId', '==', id))

        const snapshot = await getDocs(q)

        const liteTierlists: LiteTierlist[] = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: data.id,
                name: data.name,
            }
        })

        this.states.liteTierlistsState.set(liteTierlists)
        const name = Texts.SELECTION_CATEGORIES[id as keyof typeof Texts.SELECTION_CATEGORIES]
        this.states.nameState.set(name)

        this.states.initDoneState.set(true)
    }
}