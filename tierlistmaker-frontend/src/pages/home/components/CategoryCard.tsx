import {SendToBack} from "lucide-react";

// import {useNavigate} from "react-router-dom";

import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {motion} from "framer-motion";
import CATEGORY_IMAGES from "@/assets/categories/categoryImages";
import {isXsWindow} from "@/utils";


interface CategoryCardProps {
    categoryId: string
    categoryName: string
    onOpen?: () => void
}

const HEIGHT = isXsWindow() ? 210 : 200

const WIDTH = (16 / 10) * HEIGHT


export function CategoryCardSkeleton() {
    return <Skeleton className="rounded-2xl mx-auto sm:mx-0" style={{width: WIDTH, height: HEIGHT}}/>

}

export default function ({categoryId, categoryName, onOpen}: CategoryCardProps) {
    // const navigate = useNavigate()

    const [imageLoaded, setImageLoaded] = useState<boolean>(false)

    return <motion.div whileHover={{scale: 0.97}}
                       whileTap={{scale: 0.93}}
                       className="tier-list-card mx-auto sm:mx-0" style={{width: WIDTH, height: HEIGHT}}
                       transition={{duration: 0.2}}
                       initial={{opacity: 0.5, scale: 0.90}}
                       animate={{opacity: 1, scale: 1}}
                       exit={{opacity: 0.5, scale: 0.90}}
                       onClick={onOpen}

    >

        {/*<h3 style={{maxWidth: WIDTH}}*/}
        {/*    className="font-bold text-lg overflow-hidden text-ellipsis grays">{tierlist.name}</h3>*/}

        <img draggable="false" width={WIDTH} className="h-full aspect-video object-fill object-center selector"
             src={CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES]}
             style={{display: imageLoaded ? 'block' : 'none'}}
             alt={categoryName}
             onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && <Skeleton className="rounded-2xl" style={{width: WIDTH, height: HEIGHT}}/>}

        <motion.div whileHover={{scale: 0.97}}
                    className="leading-2 absolute left-3 bottom-3 right-3 mt-2 flex w-fit max-w-[calc(100%-24px)] items-center rounded-lg bg-white px-3 py-1 font-medium text-gray-700 shadow-sm">
            <div

                className="inline-block h-[1em] w-[1em] leading-none mr-1">
                <p className="inline-block h-[1em] w-[1em] leading-none [&amp;_svg]:h-[1em] [&amp;_svg]:w-[1em]">
                    <SendToBack className="h-[1em] w-[1em]"/>
                </p>
            </div>

            <p className="truncate select-none">{categoryName}</p>


        </motion.div>


    </motion.div>
}