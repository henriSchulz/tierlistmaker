import {Box} from "@/components/ui/box";
import {DragEvent, useEffect, useState} from "react";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {useNavigate, useParams} from "react-router-dom";
import {Card, CardDescription, CardTitle} from "@/components/ui/card";
import Texts from "@/text/Texts";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Paths from "@/Paths";
import TextKeys from "@/text/TextKeys";
import DroppableTier from "@/pages/create-tierlist/components/DroppableTier";

import {Button} from "@/components/ui/button";
import {Edit, ThumbsUp, Trash} from "lucide-react";
import DeleteTemplateController from "@/pages/create-tierlist/features/delete-template/DeleteTemplateController";
import DeleteTemplateModal from "@/pages/create-tierlist/features/delete-template/DeleteTemplateModal";
import AuthenticationService from "@/services/AuthenticationService";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {useAuthDone} from "@/App";


const COLORS = ["#de3030", "#e07a34", "#e2c337", "#9dbd3d", "#40d6cf", "#3d9dbd", "#ab567e", "#db2b7d"]


export default function CreateTierlistPage() {

    const {id} = useParams<{ id: string }>()

    const [initDone, setInitDone] = useState<boolean>(false)

    const [isTierlistVoted, setIsTierlistVoted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [tierlist, setTierlist] = useState<Tierlist | null>(null)
    const [tierlistVotes, setTierlistVotes] = useState<number>(0)
    const [tierlistRows, setTierlistRows] = useState<TierlistRow[]>([])
    const [tierlistItems, setTierlistItems] = useState<TierlistItem[]>([])
    const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState<boolean>(false)
    const [showImageNames, setShowImageNames] = useState<boolean>(false)

    const authDone = useAuthDone()

    const [tierlistData, setTierlistData] = useState<(TierlistItem & { rowId: string })[] | null>(null)
    const navigate = useNavigate()
    const controller = new CreateTierlistController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            tierlistVotesState: {val: tierlistVotes, set: setTierlistVotes},
            tierlistState: {val: tierlist, set: setTierlist},
            tierlistRowsState: {val: tierlistRows, set: setTierlistRows},
            tierlistItemsState: {val: tierlistItems, set: setTierlistItems},
            tierlistDataState: {val: tierlistData, set: setTierlistData},
            isTierlistVotedState: {val: isTierlistVoted, set: setIsTierlistVoted},
            isLoadingState: {val: isLoading, set: setIsLoading},
        },
        navigate
    })


    useEffect(() => {
        console.log("Calling effect", authDone)
        if (!authDone) return
        controller.init(id)
    }, [id, authDone])

    useEffect(() => {
        controller.saveTierlistLocal()
    }, [tierlistData])

    const handleDragStart = (e: DragEvent, item: TierlistItem) => {
        e.dataTransfer.setData('itemId', item.id);
    };

    const deleteTemplateController = new DeleteTemplateController({
        navigate, controller, states: {
            showState: {val: showDeleteTemplateModal, set: setShowDeleteTemplateModal}
        }
    })

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

    const isOwner = tierlist?.clientId === AuthenticationService.current?.id


    return (
        <div>
            {showDeleteTemplateModal && <DeleteTemplateModal controller={deleteTemplateController}/>}
            <Box gridCenter>



                <Card className="lg:w-5/6 mt-10 p-4 mb-8 w-11/12 overflow-hidden">

                    {initDone && tierlist && <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate(Paths.HOME)}>{Texts.HOMEPAGE}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink>{Texts.CATEGORIES}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sm">
                                    {Texts.SELECTION_CATEGORIES[tierlist.categoryId as keyof TextKeys["SELECTION_CATEGORIES"]]}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>}

                    {!initDone && <Skeleton className="w-[250px] h-[20px] rounded-full"/>}


                    {initDone &&
                        <Box className="mt-4 lg:flex lg:justify-between space-y-2">

                            <CardTitle className="text-4xl font-bold">{tierlist?.name} {Texts.TIER_LIST}</CardTitle>


                            {isOwner &&
                                <Box className="lg:ml-3 hidden lg:block">
                                    <Button className="mr-3" disabled={isLoading || !initDone}
                                            onClick={() => navigate(Paths.EDIT_TEMPLATE.replace(":id", tierlist?.id ?? ""))}>
                                        <Edit className="mr-2"/>
                                        {Texts.EDIT}
                                    </Button>

                                    <Button disabled={isLoading || !initDone}
                                            onClick={() => deleteTemplateController.open()}>
                                        <Trash className="mr-2"/>
                                        {Texts.DELETE}
                                    </Button>
                                </Box>}


                        </Box>
                    }
                    {!initDone && <Skeleton className="lg:w-[550px] w-full h-[40px] rounded-full mt-4"/>}

                    <Box className="mt-4">
                        {initDone && <Box className="lg:flex lg:justify-between">
                            <CardDescription className="text-lg">{tierlist?.description}</CardDescription>

                            <Box className="flex mt-2">

                                <div className="flex items-center space-x-2 ml-4">
                                    <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                            id="show-image-names"/>
                                    <Label htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                                </div>

                                <Button variant="secondary" className="ml-6" onClick={controller.toggleVoteTierlist}
                                        disabled={isLoading || !initDone}>
                                    <Box flexCenter>
                                        <span className="mr-2 text-lg">{tierlistVotes}</span>

                                        {isTierlistVoted ? <ThumbsUp fill="black"/> : <ThumbsUp/>}
                                    </Box>
                                </Button>
                            </Box>


                        </Box>}

                        {!initDone && <Skeleton className="lg:w-[700px] w-full h-[28px] rounded-full"/>}
                    </Box>


                    <Box id="tierlist" spacing={1} className={`mt-8`}>
                        {initDone && tierlistRows.sort((a,b) => a.rowNumber - b.rowNumber).map((row, index) => {
                            return <DroppableTier key={row.id}
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

                    <Box className="mt-12">
                        <DroppableTier showImageNames={showImageNames}
                                       row={{id: "default", name: "", tierlistId: "", rowNumber: -1, clientId: ""}}
                                       handleDragStart={handleDragStart}
                                       controller={controller}
                                       hideLabel
                                       color={""}
                        />
                    </Box>

                    {AuthenticationService.current?.id === tierlist?.clientId &&
                        <Box className="mt-5 lg:hidden flex justify-between">
                            <Button className="mr-3" disabled={isLoading || !initDone}
                                    onClick={() => navigate(Paths.EDIT_TEMPLATE.replace(":id", tierlist?.id ?? ""))}>
                                <Edit className="mr-2"/>
                                {Texts.EDIT}
                            </Button>

                            <Button disabled={isLoading || !initDone}
                                    onClick={() => deleteTemplateController.open()}>
                                <Trash className="mr-2"/>
                                {Texts.DELETE}
                            </Button>
                        </Box>}

                </Card>

            </Box>
        </div>
    )

}