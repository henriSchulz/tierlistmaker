import State from "@/types/State";



export interface ModalControllerOptions {
    states: {
        showState: State<boolean>
    },

}


export default abstract class ModalController<T extends ModalControllerOptions> {

    public states: T["states"]


     constructor(options: T) {
        this.states = options.states

    }


    public abstract open(): void

    public abstract close(): void

    public abstract submit(): void


}