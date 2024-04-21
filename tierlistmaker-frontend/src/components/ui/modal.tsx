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

}


const Modal = ({controller, title, children}: ModalProps) => {
    return <Dialog open={controller.states.showState.val} onOpenChange={controller.states.showState.set}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

Modal.displayName = "Modal"

export {Modal}