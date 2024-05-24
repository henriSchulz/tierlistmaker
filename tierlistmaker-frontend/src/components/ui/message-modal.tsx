import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";

import CustomButton from "@/components/custom/Button"


import Texts from "@/text/Texts";

interface MessageModalProps {
    controller: ModalController<ModalControllerOptions>
    title: string
    message: string

    cancelButtonText?: string
    confirmButtonText?: string

    showCancelButton?: boolean
}

import {Modal as OModal} from "@/components/ui/modal";


const Modal = (props: MessageModalProps) => {
    return <OModal hideFooter title={props.title} controller={props.controller}>


        <div className="p-4" dangerouslySetInnerHTML={{__html: props.message}}>

        </div>


        <div className="flex w-full justify-end gap-3">
            {props.showCancelButton && <CustomButton variant="tertiary"
                                                     onClick={props.controller.close}>{props.cancelButtonText || Texts.CANCEL}</CustomButton>}
            <CustomButton variant="secondary"
                          onClick={props.controller.submit}>{props.confirmButtonText || Texts.OK}</CustomButton>
        </div>

    </OModal>

}

Modal.displayName = "Modal"

export {Modal}