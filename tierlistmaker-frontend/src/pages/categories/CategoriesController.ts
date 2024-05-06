import State from "@/types/State";



interface CategoriesControllerOptions {
    states: {
        initDoneState: State<boolean>
    }
}

export default class CategoriesController {
    states: CategoriesControllerOptions['states']

    constructor(options: CategoriesControllerOptions) {
        this.states = options.states
    }

    init = () => {

        this.states.initDoneState.set(true)
    }

}