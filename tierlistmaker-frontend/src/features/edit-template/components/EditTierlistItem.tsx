import TierlistItem from "@/types/dbmodel/TierlistItem";

import EditTemplateController from "@/features/edit-template/EditTemplateController";
import {useEffect, useState} from "react";
import {Trash} from "lucide-react";
import {motion} from "framer-motion";
import {storage} from "@/config/firebaseConfig";
import {getDownloadURL, ref} from "@firebase/storage";


interface EditTierlistItemProps {
    item: TierlistItem
    controller: EditTemplateController
}

export default function ({item, controller}: EditTierlistItemProps) {

    const [hovering, setHovering] = useState(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>("")


    const onHover = () => {
        if (hovering) return;
        setHovering(true);
    }

    const onLeave = () => {
        setHovering(false);
    }

    useEffect(() => {

        const isGif = item.id.startsWith("g_")

        getDownloadURL(ref(storage, `${item.tierlistId}/items/${item.id}${isGif ? ".gif" : ".png"}`)).then(url => {
            setImgSrc(url)
        })

    }, [item.id])


    return <motion.div
        whileHover={{scale: 0.97}}
        whileTap={{scale: 0.93}}
        // layout
        // layoutId={item.id}
        onMouseEnter={onHover} onMouseLeave={onLeave}
        className={`relative delete-tierlist-item`}
        onClick={() => controller.onDeleteItem(item.id)}
    >
        <img
            key={item.id}
            height={40} width={40}
            src={imgSrc}
            className={`aspect-square object-fill object-center selector `}
            style={{display: imageLoaded ? 'block' : 'none'}}
            onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && <div style={{width: 40, height: 40}} className="skeleton"/>}

        {hovering && <div className="delete-tierlist-item-trash">
            <Trash/>
        </div>}
    </motion.div>

}