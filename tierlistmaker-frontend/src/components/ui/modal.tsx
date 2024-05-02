import ModalController, {ModalControllerOptions} from "@/controller/abstract/ModalController";
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React from "react";
import {Button} from "@/components/ui/button";

interface ModalProps {
    controller: ModalController<ModalControllerOptions>
    title: string
    children: React.ReactNode | string
    hideFooter?: boolean
    modal?: boolean
}


const Modal = ({controller, title, children, hideFooter, modal}: ModalProps) => {
    return <Dialog modal={modal} open={controller.states.showState.val} onOpenChange={controller.states.showState.set}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            {children}

            {!hideFooter && <DialogFooter>
                <Button type="submit">Save changes</Button>


            </DialogFooter>}
        </DialogContent>
    </Dialog>
}

Modal.displayName = "Modal"

export {Modal}