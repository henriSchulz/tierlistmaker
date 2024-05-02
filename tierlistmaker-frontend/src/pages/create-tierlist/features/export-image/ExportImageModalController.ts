import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import State from "@/types/State";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";

interface ExportImageModalControllerOptions extends ModalControllerOptions {

    states: {
        showState: State<boolean>
        loadingState: State<boolean>
        exportImageUrlState: State<string>
    }

    controller: CreateTierlistController

}

export default class ExportImageModalController extends ModalController<ExportImageModalControllerOptions> {


    states: ExportImageModalControllerOptions['states']
    controller: CreateTierlistController

    constructor(options: ExportImageModalControllerOptions) {
        super(options)
        this.states = options.states
        this.controller = options.controller


    }


    open = async () => {
        this.states.showState.set(true)
        this.states.loadingState.set(true)
        const exportImage = await this.controller.getExportImage()
        this.states.exportImageUrlState.set(exportImage)
        this.states.loadingState.set(false)

    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        //download image

        const a = document.createElement("a")
        a.href = this.states.exportImageUrlState.val
        a.download = this.controller.states.tierlistState.val!.name.split(" ").join("-") + "-tierlist.png"
        a.click()

    }


}