import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import React from "react";


interface ModalProps {
    controller: ModalController<ModalControllerOptions>
    title: string
    children: React.ReactNode | string
    hideFooter?: boolean
    modal?: boolean
}


const Modal = ({controller, title, children, modal}: ModalProps) => {
    return <Dialog modal={modal} open={controller.states.showState.val} onOpenChange={controller.states.showState.set}>
        <DialogContent>
            <DialogHeader>
                <div className="text-3xl font-bold leading-none text-gray-700">{title}</div>
            </DialogHeader>

            {children}

        </DialogContent>
    </Dialog>
}

Modal.displayName = "Modal"

export {Modal}