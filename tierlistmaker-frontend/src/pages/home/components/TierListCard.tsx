import {Box} from "@/components/ui/box";
import {Button} from "@/components/ui/button";
import Texts from "@/text/Texts";
import {Card} from "@/components/ui/card";
import {ExternalLink} from "lucide-react";
import LiteTierlist from "@/types/LiteTierlist";
import Settings from "@/Settings";
import {useNavigate} from "react-router-dom";
import {PathUtils} from "@/Paths";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";


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

    return <Card className="p-4">



        <Box>
            <h3 style={{maxWidth: WIDTH}}
                className="font-bold text-lg overflow-hidden text-ellipsis">{tierlist.name}</h3>

            <img width={WIDTH} className="aspect-square object-fill object-center selector"
                 src={
                     `${Settings.API_URL}/cover-image/${tierlist.id}`
                 }
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