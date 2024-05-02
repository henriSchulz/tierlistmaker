import TierlistItem from "@/types/dbmodel/TierlistItem";

import EditTemplateController from "@/pages/edit-template/EditTemplateController";
import {useEffect, useState} from "react";
import {Trash} from "lucide-react";
import {Box} from "@/components/ui/box";
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


    return <Box onMouseEnter={onHover} onMouseLeave={onLeave}
                className={`relative delete-tierlist-item`}
                onClick={() => controller.onDeleteItem(item.id)}
    >
        <img
            key={item.id}
            height={60} width={60}
            src={imgSrc}
            className={`aspect-square object-fill object-center selector `}
            style={{display: imageLoaded ? 'block' : 'none'}}
            onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && <div style={{width: 60, height: 60}} className="skeleton"/>}

        {hovering && <div className="delete-tierlist-item-trash">
            <Trash/>
        </div>}
    </Box>

}