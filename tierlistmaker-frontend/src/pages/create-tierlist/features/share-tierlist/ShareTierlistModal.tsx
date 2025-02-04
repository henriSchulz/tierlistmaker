import ShareTierlistController from "@/pages/create-tierlist/features/share-tierlist/ShareTierlistController";
import {Modal} from "@/components/ui/modal";
import Texts from "@/text/Texts";
import CopyToClipboard from "@/components/CopyToClipboard";
import CustomButton from "@/components/custom/Button";

interface ShareTierlistModalProps {
    controller: ShareTierlistController
}

export default function ({controller}: ShareTierlistModalProps) {

    return <Modal hideFooter controller={controller} title={Texts.SHARE_YOUR_RANKING}>
        <CopyToClipboard text={controller.controller.getShareRankingUrl()}/>
        <CustomButton variant="secondary" onClick={controller.close}>{Texts.CLOSE}</CustomButton>
    </Modal>

}