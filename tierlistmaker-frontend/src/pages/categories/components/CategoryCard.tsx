import {Box} from "@/components/ui/box";
import {Button} from "@/components/ui/button";
import Texts from "@/text/Texts";
import {Card} from "@/components/ui/card";
import {ExternalLink} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Paths from "@/Paths";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import CATEGORY_IMAGES from "@/assets/categories/categoryImages";

interface CategoryCardProps {
    categoryId: string
    categoryName: string
}

const WIDTH = 250
const HEIGHT = 250

export function CategoryCardSkeleton() {
    return <Card className="p-4 my-1">
        <Box>

            <Skeleton className="h-[20px] w-full"/>

            <Skeleton className="mt-2" style={{width: WIDTH, height: HEIGHT}}/>

            <Button disabled className="mt-3 w-full">
                {Texts.VIEW_TEMPLATES}
                <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>

        </Box>
    </Card>

}

export default function ({categoryId, categoryName}: CategoryCardProps) {
    const navigate = useNavigate()

    const [imageLoaded, setImageLoaded] = useState<boolean>(false)


    return <Card className="p-4">
        <Box>
            <h3 style={{maxWidth: WIDTH}}
                className="font-bold text-lg overflow-hidden text-ellipsis">{categoryName}</h3>

            <img width={WIDTH} className="aspect-square object-fill object-center selector"
                 draggable="false"
                // @ts-ignore

                 src={CATEGORY_IMAGES[categoryId]}
                 style={{display: imageLoaded ? 'block' : 'none'}}
                 alt={categoryName}
                 onLoad={() => setImageLoaded(true)}
            />

            {!imageLoaded && <Skeleton style={{width: WIDTH, height: HEIGHT}}/>}

            <Button onClick={() => navigate(Paths.CATEGORY.replace(":id", categoryId))} className="mt-3 w-full">
                {Texts.VIEW_TEMPLATES}
                <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>

        </Box>
    </Card>
}