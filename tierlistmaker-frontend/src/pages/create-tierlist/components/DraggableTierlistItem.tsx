import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {DragEvent, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Skeleton} from "@/components/ui/skeleton";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import {isXsWindow} from "@/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface DraggableTierlistItemProps {
    item: TierlistItem & { rowId: string }
    index: number
    controller: CreateTierlistController
    handleDragStart: (e: DragEvent, item: TierlistItem) => void
    showImageNames: boolean
}

export const IMAGE_HEIGHT = isXsWindow() ? 80 : 100;


export default function ({item, handleDragStart, showImageNames, controller}: DraggableTierlistItemProps) {


    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>("")

    useEffect(() => {

        const isGif = item.id.startsWith("g_")

        getDownloadURL(ref(storage, `${item.tierlistId}/items/${item.id}${isGif ? ".gif" : ".png"}`)).then(url => {
            setImgSrc(url)
        })

    }, [item.id])

    return <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger>
                <div className="flex flex-row relative">
                    <DropIndicator beforeId={item.id} rowId={item.rowId}/>
                    <motion.div transition={{duration: 0.2}}
                                onDragStart={(e) => {
                                    const element = e.target as HTMLElement;
                                    element.click();
                                    // @ts-ignore
                                    handleDragStart(e, item);
                                }}
                                className="cursor-grab active:cursor-grabbing my-auto unselectable"
                                draggable={true} layout layoutId={item.id}
                    >
                        <img
                            onLoad={() => setImageLoaded(true)}
                            key={item.id}
                            height={IMAGE_HEIGHT} width={IMAGE_HEIGHT}
                            alt={item.name}
                            src={imgSrc}
                            className={`aspect-square object-fill object-center selector`}
                            style={{display: imageLoaded ? 'block' : 'none', userSelect: "none"}}
                        />

                        {!imageLoaded &&
                            <Skeleton style={{width: IMAGE_HEIGHT, height: IMAGE_HEIGHT, borderRadius: 0}}/>}
                        {showImageNames &&
                            <div className="tier-list-item-text grays text-xs text-center"
                                 style={{maxWidth: IMAGE_HEIGHT - 5}}>
                                {item.name}
                            </div>}
                    </motion.div>
                </div>
            </TooltipTrigger>

            {!showImageNames && controller.states.tierlistState.val?.showImageNames && <TooltipContent>
                <div
                    onClick={() => window.open("https://google.com/search?q=" + encodeURIComponent(item.name + " " + controller.states.tierlistState.val?.name))}
                    className="text-xs blues">{item.name}</div>
            </TooltipContent>}
        </Tooltip>
    </TooltipProvider>
}

export const DropIndicator = ({beforeId, rowId}: { beforeId: string | null, rowId: string }) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={rowId}
            className={`transition ease-in-out h-[${IMAGE_HEIGHT}px] bg-neutral-400 opacity-0`}
        />
    );
};