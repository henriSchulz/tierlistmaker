import ExportImageModalController from "@/pages/create-tierlist/features/export-image/ExportImageModalController";
import {Modal} from "@/components/ui/modal";
import Texts from "@/text/Texts";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";


interface ExportImageModalProps {
    controller: ExportImageModalController
}

export default function ({controller}: ExportImageModalProps) {

    const isLoading = controller.states.loadingState.val;

    return <Modal  hideFooter controller={controller} title={Texts.DOWNLOAD_IMAGE}>

      <div className="grid place-items-center">
          {!isLoading &&
              <img style={{height: 300}} src={controller.states.exportImageUrlState.val} alt="Tierlist"/>}

          {isLoading && <Skeleton className="h-[300px] w-full"/>}

          <Button disabled={isLoading} onClick={() => controller.submit()} className="w-full mt-2">
              {Texts.DOWNLOAD_IMAGE}
          </Button>
      </div>

    </Modal>

}