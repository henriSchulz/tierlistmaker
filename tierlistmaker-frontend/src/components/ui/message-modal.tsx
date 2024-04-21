import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import Texts from "@/text/Texts";

interface MessageModalProps {
    controller: ModalController<ModalControllerOptions>
    title: string
    message: string

    cancelButtonText?: string
    confirmButtonText?: string
}


const Modal = (props: MessageModalProps) => {
    return <AlertDialog open={props.controller.states.showState.val}
                        onOpenChange={props.controller.states.showState.set}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{props.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {props.message}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel
                    onClick={props.controller.close}>{props.cancelButtonText || Texts.CANCEL}</AlertDialogCancel>
                <AlertDialogAction
                    onClick={props.controller.submit}>{props.confirmButtonText || Texts.CONFIRM}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

}

Modal.displayName = "Modal"

export {Modal}