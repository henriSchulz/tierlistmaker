import TierlistItem from "@/types/dbmodel/TierlistItem";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Skeleton} from "@/components/ui/skeleton";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import SharedTierlistController from "@/pages/shared/SharedTierlistController";

interface DraggableTierlistItemProps {
    item: TierlistItem & { rowId: string }
    index: number
    controller: SharedTierlistController
    showImageNames: boolean
}

export const IMAGE_HEIGHT = 100;


export default function ({item, showImageNames}: DraggableTierlistItemProps) {


    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>("")

    useEffect(() => {

        const isGif = item.id.startsWith("g_")

        getDownloadURL(ref(storage, `${item.tierlistId}/items/${item.id}${isGif ? ".gif" : ".png"}`)).then(url => {
            setImgSrc(url)
        })

    }, [item.id])

    return <div className="flex flex-row relative">
        <motion.div
            className="my-auto max-w-[130px]"
            layout layoutId={item.id}>
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
