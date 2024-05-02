import GoogleImageSearchController from "@/features/google-images-search/GoogleImageSearchController";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Google from "@/assets/google.svg";

import {Dialog, DialogContent, DialogFooter, DialogHeader} from "@/components/ui/dialog";
import ImageSearchItem, {ImageSearchItemLoading} from "@/features/google-images-search/components/ImageSearchItem";
import Texts from "@/text/Texts";
import {Search} from "lucide-react";


interface GoogleImageSearchModalProps {
    controller: GoogleImageSearchController;
}


export default function ({controller}: GoogleImageSearchModalProps) {


    return <Dialog open={controller.states.showState.val} onOpenChange={controller.states.showState.set}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-full md:min-w-[650px]">
            <DialogHeader>
                <div className="flex justify-start items-center space-x-4">
                    <img src={Google} height={40} width={40}/>
                    <h3 className="font-bold text-3xl">{Texts.GOOGLE_IMAGE_SEARCH}</h3>
                </div>
                <div className="flex justify-center items-center space-x-2 pt-4">
                    <Input //disabled={controller.states.loadingState.val}
                        value={controller.states.searchInput.val}
                        onChange={e => controller.states.searchInput.set(e.target.value)}


                        placeholder="Enter Search...."></Input>


                    <Button variant="secondary" disabled={controller.states.loadingState.val}
                            onClick={() => controller.search()}>
                        Search
                        <Search className="ml-2"/>
                    </Button>
                </div>
            </DialogHeader>

            <div className="">


                <div className="flex flex-wrap">
                    {!controller.states.loadingState.val && controller.states.currentImages.val.slice(0, 25)
                        .map((image, index) => {
                            return <ImageSearchItem image={image} controller={controller} key={index}/>
                        })}

                    {controller.states.currentImages.val.length === 0 && Array.from({length: 25}, (_, index) => {
                        return <ImageSearchItemLoading key={index}/>
                    })}


                </div>


            </div>


            {controller.states.currentImages.val.length > 0 && <DialogFooter>
                <Button disabled={controller.states.selectedImagesState.val.length === 0} onClick={() => {
                    controller.submit();
                }
                } className="w-full">
                    {Texts.ADD_IMAGES}
                </Button>
            </DialogFooter>}

        </DialogContent>
    </Dialog>

}


