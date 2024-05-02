import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {DragEvent, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Skeleton} from "@/components/ui/skeleton";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import {isXsWindow} from "@/utils";

interface DraggableTierlistItemProps {
    item: TierlistItem & { rowId: string }
    index: number
    controller: CreateTierlistController
    handleDragStart: (e: DragEvent, item: TierlistItem) => void
    showImageNames: boolean
}

export const IMAGE_HEIGHT = isXsWindow() ? 80 : 100;


export default function ({item, handleDragStart, showImageNames}: DraggableTierlistItemProps) {


    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>("")

    useEffect(() => {

        const isGif = item.id.startsWith("g_")

        getDownloadURL(ref(storage, `${item.tierlistId}/items/${item.id}${isGif ? ".gif" : ".png"}`)).then(url => {
            setImgSrc(url)
        })

    }, [item.id])

    return <div className="flex flex-row relative">
        <DropIndicator beforeId={item.id} rowId={item.rowId}/>
        <motion.div
            onDragStart={(e) => {
                // @ts-ignore
                handleDragStart(e, item);
            }}
            className="cursor-grab active:cursor-grabbing my-auto max-w-[130px]"
            draggable={true} layout layoutId={item.id}>
            <img
                onLoad={() => setImageLoaded(true)}
                key={item.id}
                height={IMAGE_HEIGHT} width={IMAGE_HEIGHT}
                alt={item.name}
                src={imgSrc}
                className={`aspect-square object-fill object-center selector`}
                style={{display: imageLoaded ? 'block' : 'none'}}
            />

            {!imageLoaded && <Skeleton style={{width: IMAGE_HEIGHT, height: IMAGE_HEIGHT}}/>}
            {showImageNames &&
                <div className="tier-list-item-text text-xs text-center" style={{maxWidth: IMAGE_HEIGHT - 5}}>
                    {item.name}
                </div>}
        </motion.div>
    </div>
}

export const DropIndicator = ({beforeId, rowId}: { beforeId: string | null, rowId: string }) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={rowId}
            className={`my-0.5 w-0.5 h-[${IMAGE_HEIGHT}px] bg-neutral-400 opacity-0`}
        />
    );
};