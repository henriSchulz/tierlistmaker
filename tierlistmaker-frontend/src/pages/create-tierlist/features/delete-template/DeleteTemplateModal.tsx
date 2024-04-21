import DeleteTemplateController from "@/pages/create-tierlist/features/delete-template/DeleteTemplateController";
import {Modal} from "@/components/ui/message-modal";
import Texts from "@/text/Texts";

interface DeleteTemplateModalProps {
    controller: DeleteTemplateController
}

export default function ({controller}: DeleteTemplateModalProps) {


    return <Modal confirmButtonText={Texts.DELETE} controller={controller} title={Texts.DELETE_TEMPLATE + "?"}
                  message={Texts.DELETE_TEMPLATE_MESSAGE}/>


}