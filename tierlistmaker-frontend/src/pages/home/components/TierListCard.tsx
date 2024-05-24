import {SendToBack} from "lucide-react";
import LiteTierlist from "@/types/LiteTierlist";
import {useNavigate} from "react-router-dom";

import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import {motion} from "framer-motion";
import {PathUtils} from "@/Paths";
import {isXsWindow} from "@/utils";


interface TierListCardProps {
    tierlist: LiteTierlist
}

const HEIGHT = isXsWindow() ? 210 : 200

const WIDTH = (16 / 10) * HEIGHT


export function TierlistCardSkeleton() {
    return <Skeleton className="rounded-2xl mx-auto sm:mx-0" style={{width: WIDTH, height: HEIGHT}}/>

}

export default function ({tierlist}: TierListCardProps) {
    const navigate = useNavigate()

    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>("")

    useEffect(() => {
        getDownloadURL(ref(storage, `${tierlist.id}/cover.png`)).then(url => {
            setImgSrc(url)
        })
    }, [tierlist.id])

    return <motion.div whileHover={{scale: 0.97}} whileTap={{scale: 0.93}}
                       className="tier-list-card mx-auto sm:mx-0" style={{width: WIDTH, height: HEIGHT}}
                       transition={{duration: 0.2}}
                       initial={{opacity: 0.5, scale: 0.90, translateZ: 10}}
                       animate={{opacity: 1, scale: 1, translateZ: 0}}
                       exit={{opacity: 0.5, scale: 0.9,}}
                       onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist))}

    >

        <img draggable="false" className={`w-full md:w-[${WIDTH}px] h-full aspect-video object-fill object-center selector`}
             src={imgSrc}
             style={{display: imageLoaded ? 'block' : 'none'}}
             alt={tierlist.name}
             onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && <Skeleton className="rounded-2xl" style={{width: WIDTH, height: HEIGHT}}/>}

        <motion.div whileHover={{scale: 0.97}}
                    className="leading-2 absolute left-3 bottom-3 right-3 mt-2 flex w-fit max-w-[calc(100%-24px)] items-center rounded-lg bg-white px-3 py-1 font-medium text-gray-700 shadow-sm">
            <div onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist))}

                 className="inline-block h-[1em] w-[1em] leading-none mr-1">
                <p className="inline-block h-[1em] w-[1em] leading-none [&amp;_svg]:h-[1em] [&amp;_svg]:w-[1em]">
                    <SendToBack className="h-[1em] w-[1em]"/>
                </p>
            </div>

            <p className="truncate select-none">{tierlist.name}</p>


        </motion.div>


    </motion.div>
}