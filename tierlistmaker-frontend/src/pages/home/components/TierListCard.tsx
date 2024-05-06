import {Box} from "@/components/ui/box";
import {Button} from "@/components/ui/button";
import Texts from "@/text/Texts";
import {Card} from "@/components/ui/card";
import {ExternalLink} from "lucide-react";
import LiteTierlist from "@/types/LiteTierlist";
import {useNavigate} from "react-router-dom";
import {PathUtils} from "@/Paths";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";


interface TierListCardProps {
    tierlist: LiteTierlist
}

const WIDTH = 250
const HEIGHT = 250

export function TierlistCardSkeleton() {
    return <Card className="p-4 my-1">
        <Box>

            <Skeleton className="h-[20px] w-full"/>

            <Skeleton className="mt-2" style={{width: WIDTH, height: HEIGHT}}/>

            <Button disabled className="mt-3 w-full">
                {Texts.RANK_NOW}
                <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>

        </Box>
    </Card>

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

    return <Card className="p-4">
        <Box>
            <h3 style={{maxWidth: WIDTH}}
                className="font-bold text-lg overflow-hidden text-ellipsis grays">{tierlist.name}</h3>

            <img draggable="false" width={WIDTH} className="aspect-square object-fill object-center selector"
                 src={imgSrc}
                 style={{display: imageLoaded ? 'block' : 'none'}}
                 alt={tierlist.name}
                 onLoad={() => setImageLoaded(true)}
            />

            {!imageLoaded && <Skeleton style={{width: WIDTH, height: HEIGHT}}/>}

            <Button onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist))} className="mt-3 w-full">
                {Texts.RANK_NOW}
                <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>

        </Box>
    </Card>
}