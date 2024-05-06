
import {Modal} from "@/components/ui/message-modal";
import Texts from "@/text/Texts";
import SupportModalController from "@/features/support-modal/SupportModalController";

interface SupportModalProps {
    controller: SupportModalController
}


export default function ({controller}: SupportModalProps) {

    return <Modal controller={controller} title={Texts.SUPPORT} message={Texts.SUPPORT_MESSAGE}/>

}