import {Box} from "@/components/ui/box";
import {DragEvent, useEffect, useState} from "react";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";

import TierlistItem from "@/types/dbmodel/TierlistItem";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Card} from "@/components/ui/card";
import Texts from "@/text/Texts";
import {Skeleton} from "@/components/ui/skeleton";


import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {useAuthDone} from "@/App";

import {Separator} from "@/components/ui/separator";
import Icon from "@/assets/icon.png"

import SharedTierlistController from "@/pages/shared/SharedTierlistController";
import Tier from "@/pages/shared/components/Tier";
import {Helmet} from "react-helmet";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";


const COLORS = ["#de3030", "#e07a34", "#e2c337", "#9dbd3d", "#40d6cf", "#3d9dbd", "#ab567e", "#db2b7d"]


export default function SharedTierlistPage() {

    const {id} = useParams<{ id: string }>()

    const [initDone, setInitDone] = useState<boolean>(false)

    const [tierlist, setTierlist] = useState<Tierlist | null>(null)
    const [tierlistRows, setTierlistRows] = useState<TierlistRow[]>([])
    const [tierlistItems, setTierlistItems] = useState<TierlistItem[]>([])
    const [createdBy, setCreatedBy] = useState<string>("")

    const [showImageNames, setShowImageNames] = useState<boolean>(
        (localStorage.getItem("showImageNames") === "true") || false
    )

    const [searchParams, setSearchParams] = useSearchParams()

    const authDone = useAuthDone()

    const [tierlistData, setTierlistData] = useState<(TierlistItem & { rowId: string })[] | null>(null)
    const navigate = useNavigate()
    const controller = new SharedTierlistController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            tierlistState: {val: tierlist, set: setTierlist},
            tierlistRowsState: {val: tierlistRows, set: setTierlistRows},
            tierlistItemsState: {val: tierlistItems, set: setTierlistItems},
            tierlistDataState: {val: tierlistData, set: setTierlistData},
            createdByState: {val: createdBy, set: setCreatedBy}
        },
        navigate, searchParams
    })


    useEffect(() => {
        if (!authDone) return
        controller.init(id)
    }, [id, authDone])

    useEffect(() => {
        localStorage.setItem("showImageNames", String(showImageNames))
    }, [showImageNames])


    const handleDragStart = (e: DragEvent, item: TierlistItem) => {
        e.dataTransfer.setData('itemId', item.id);
    };


    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                setShowImageNames(p => !p)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }

    }, [showImageNames])


    return (
        <div>

            <Helmet>
                <title>
                    {initDone ? Texts.USER_RANKING_TITLE.replace("{name}", createdBy)
                        .replace("{tierlist}", tierlist!.name) : ""}
                </title>
            </Helmet>

            <Box gridCenter>
                <Card className="lg:w-5/6 mt-10 p-4 mb-8 w-11/12 overflow-hidden">


                    <Box id="tierlist" className={`bg-white dark:bg-[#020817]`}>
                        <Box>
                            <Box id="tierlist-inner-container" className={"space-y-2 p-5"}>

                                <Box className="grid lg:flex lg:justify-between items-center">
                                    <h3 className="ml-5 text-3xl font-bold items-center">{
                                        initDone && Texts.USER_RANKING_TITLE.replace("{name}", createdBy)
                                            .replace("{tierlist}", tierlist!.name)
                                    }</h3>
                                    <Box className="mb-5 flex justify-end items-center">
                                        <img src={Icon} alt="icon" className="w-16 h-16"/>


                                        <div className="flex items-center">
                                            <h3 style={{fontWeight: 500}}
                                                className="ml-5 title text-5xl leading-none tracking-tight text-gray-900 dark:text-white">
                                                Tierlistmaker.org
                                            </h3>
                                        </div>

                                    </Box></Box>


                                {initDone && tierlistRows.sort((a, b) => a.rowNumber - b.rowNumber).map((row, index) => {
                                    return <Tier key={row.id}
                                                 row={row}
                                                 handleDragStart={handleDragStart}
                                                 controller={controller}
                                                 color={COLORS[index]}

                                                 showImageNames={showImageNames}
                                    />
                                })}

                                {!initDone && <>
                                    <Skeleton className="w-full h-[100px] flex mb-2"/>
                                    <Skeleton className="w-full h-[100px] flex mb-2"/>
                                    <Skeleton className="w-full h-[100px] flex mb-2"/>
                                    <Skeleton className="w-full h-[100px] flex mb-2"/>
                                    <Skeleton className="w-full h-[100px] flex mb-2"/>
                                </>}

                            </Box>
                        </Box>
                    </Box>

                    <Box className="mt-5">
                        <Separator/>
                        <Box className="md:flex md:justify-between grid mt-2 items-center">
                            <div className="flex items-center mt-4">
                                <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                        id="show-image-names"/>
                                <Label className="ml-2"
                                       htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                            </div>


                            <Button
                                onClick={() => {
                                    setSearchParams(new URLSearchParams())
                                    window.open(window.location.href.replace("shared", "create"))

                                }}>
                                <ExternalLink className="mr-2"/>
                                {Texts.RANK_YOURSELF}
                            </Button>


                        </Box>
                    </Box>

                </Card>

            </Box>
        </div>
    )

}