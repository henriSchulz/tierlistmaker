import {useAuthDone} from "@/App";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LiteTierlist from "@/types/LiteTierlist";
import TierListCard, {TierlistCardSkeleton} from "@/pages/home/components/TierListCard";
import CategoryController from "@/pages/category/CategoryController";
import Texts from "@/text/Texts";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {BadgePlus} from "lucide-react";
import {Helmet} from "react-helmet";

export default function () {
    const authDone = useAuthDone()
    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [initDone, setInitDone] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [liteTierlists, setLiteTierlists] = useState<LiteTierlist[]>([])

    const controller = new CategoryController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            liteTierlistsState: {val: liteTierlists, set: setLiteTierlists},
            nameState: {val: name, set: setName}
        },
        navigate
    })


    useEffect(() => {
        if (!authDone) return

        controller.init(id)
    }, [authDone])


    // @ts-ignore
    return <div className="grid place-items-center">

        <Helmet>
            <title>
                {name} {Texts.TEMPLATES} - Tierlistmaker
            </title>
        </Helmet>

        <Card className="lg:w-5/6 mt-10 p-4 mb-8 w-11/12 overflow-hidden min-h-96">
            <div>

                {initDone && <h1 className="text-4xl font-bold mb-4">{name} {Texts.TEMPLATES}</h1>}

                {!initDone && <Skeleton className="h-[35px] mb-4 w-full md:w-1/2"/>}

                <div className="flex flex-wrap gap-4 w-full whitespace-nowrap">
                    {initDone && liteTierlists.map(liteTierlist => {
                        return <TierListCard key={liteTierlist.id} tierlist={liteTierlist}/>
                    })}

                    {!initDone && Array.from({length: 3}).map((_, i) => {
                        return <TierlistCardSkeleton key={i}/>
                    })}

                    {liteTierlists.length === 0 && initDone && <div className="w-full">
                        <h3 className="">    {Texts.NO_TEMPLATES.replace("{category}", name)}</h3>

                        <div className="flex justify-center mt-8">

                            <Button variant="secondary"
                                    onClick={() => navigate("/create-template?c=" + id)}>
                                <BadgePlus className="mr-2"/>
                                {Texts.CREATE_CATEGORY_TEMPLATE.replace("{category}", name)}
                            </Button>

                        </div>

                    </div>}
                </div>

            </div>


        </Card>
    </div>

}