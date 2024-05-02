import GoogleImageSearchController from "@/features/google-images-search/GoogleImageSearchController";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {useState} from "react";

interface ImageSearchItemProps {
    image: { src: string, title: string },
    controller: GoogleImageSearchController
}

export default function ImageSearchItem({image, controller}: ImageSearchItemProps) {
    const [loading, setLoading] = useState(true)
    return <div>
        <img height={110} width={110} src={image.src} alt={image.title}
             onClick={() => controller.toggleSelected(image)}
             className={cn("m-1 aspect-square object-fill object-center hover:scale-105", controller.isSelected(image) && "border-2 border-blue-500 hover:scale-100", loading && "hidden")}
             onLoad={() => setLoading(false)}
        />

        {loading && <ImageSearchItemLoading/>}
    </div>
}

export function ImageSearchItemLoading() {
    return <Skeleton className="m-1 aspect-square w-[110px]"/>
}