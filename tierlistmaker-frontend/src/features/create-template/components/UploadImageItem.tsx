import {Trash} from "lucide-react";
import {useState} from "react";
import {motion} from "framer-motion";

interface UploadImageItemProps {
    image: File
    deleteItem: () => void
}

export default function ({image, deleteItem}: UploadImageItemProps) {

    const [hovering, setHovering] = useState(false);

    const onHover = () => {
        if (hovering) return;
        setHovering(true);
    }

    const onLeave = () => {
        setHovering(false);
    }

    return <motion.div whileHover={{scale: 0.97}} whileTap={{scale: 0.93}}
                       onClick={deleteItem} className="relative delete-tierlist-item" onMouseEnter={onHover}
                onMouseLeave={onLeave}
    >
        <img className="h-10 w-10 aspect-square object-fill object-center"
             src={URL.createObjectURL(image)}/>

        {hovering && <div className="delete-tierlist-item-trash">
            <Trash/>
        </div>}

    </motion.div>
}