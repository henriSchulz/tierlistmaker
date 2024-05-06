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
import XLogo from "@/assets/X_logo_2023.svg";
import RedditLogo from "@/assets/reddit.svg";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Paths from "@/Paths";
import TextKeys from "@/text/TextKeys";
import DroppableTier from "@/pages/create-tierlist/components/DroppableTier";

import {Button} from "@/components/ui/button";
import {Edit, Image, Share, ThumbsUp, Trash} from "lucide-react";
import DeleteTemplateController from "@/pages/create-tierlist/features/delete-template/DeleteTemplateController";
import DeleteTemplateModal from "@/pages/create-tierlist/features/delete-template/DeleteTemplateModal";
import AuthenticationService from "@/services/AuthenticationService";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {useAuthDone} from "@/App";

import CopyToClipboard from "@/components/CopyToClipboard";
import {Separator} from "@/components/ui/separator";

import {useTheme} from "@/components/ThemeProvider";
import Icon from "@/assets/icon.png"
import ExportImageModalController from "@/pages/create-tierlist/features/export-image/ExportImageModalController";
import ExportImageModal from "@/pages/create-tierlist/features/export-image/ExportImageModal";

import ShareTierlistController from "@/pages/create-tierlist/features/share-tierlist/ShareTierlistController";
import ShareTierlistModal from "@/pages/create-tierlist/features/share-tierlist/ShareTierlistModal";
import {Helmet} from "react-helmet";

import {setClipboard} from "@/utils";
import {toast} from "sonner";
import MessageModalController from "@/controller/MessageModalController";
import {Modal} from "@/components/ui/message-modal";


const COLORS = ["#de3030", "#e07a34", "#e2c337", "#ffa05c", "#ffa05c", "#ff6e61", "#ff4284", "#d742a8"]


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
    const [showExportImageModal, setShowExportImageModal] = useState<boolean>(false)
    const [showShareTierlistModal, setShowShareTierlistModal] = useState<boolean>(false)
    const [exportImageModalLoading, setExportImageModalLoading] = useState<boolean>(false)
    const [exportImageUrl, setExportImageUrl] = useState<string>("")
    const [showImageNames, setShowImageNames] = useState<boolean>(
        false
    )
    const [showImagesNamesModal, setShowImagesNamesModal] = useState<boolean>(false)
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const authDone = useAuthDone()

    const [tierlistData, setTierlistData] = useState<(TierlistItem & { rowId: string })[] | null>(null)
    const navigate = useNavigate()

    const showImageNamesController = new MessageModalController({
        states: {
            showState: {val: showImagesNamesModal, set: setShowImagesNamesModal}
        },
        onSubmit: () => {
            setShowImageNames(true)
            localStorage.setItem("showImageNames", "true")
        },
        onCancel: () => {
            setShowImageNames(false)
            localStorage.setItem("showImageNames", "false")
        }
    })

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
            isExportingState: {val: isExporting, set: setIsExporting},
            showImagesNamesState: {val: showImageNames, set: setShowImageNames},
            showImageNamesModalState: {val: showImagesNamesModal, set: setShowImagesNamesModal}
        },
        navigate
    })


    useEffect(() => {
        if (!authDone) return
        controller.init(id)
    }, [id, authDone])

    useEffect(() => {
        if (!initDone) return
        localStorage.setItem("showImageNames", String(showImageNames))
    }, [showImageNames, initDone])

    useEffect(() => {
        controller.saveTierlistLocal()
    }, [tierlistData])

    const handleDragStart = (e: DragEvent, item: TierlistItem) => {
        const el = e.target as HTMLElement;

        // if (el.tagName === "IMG") {
        //     e.preventDefault();
        //     setTimeout(() => document.getElementById("t-c")?.click(), 400)
        //     return;
        // }

        console.log(el)

        e.dataTransfer.setData('itemId', item.id);
    };

    const deleteTemplateController = new DeleteTemplateController({
        navigate, controller, states: {
            showState: {val: showDeleteTemplateModal, set: setShowDeleteTemplateModal}
        }
    })

    const exportImageController = new ExportImageModalController({
        controller, states: {
            showState: {val: showExportImageModal, set: setShowExportImageModal},
            loadingState: {val: exportImageModalLoading, set: setExportImageModalLoading},
            exportImageUrlState: {val: exportImageUrl, set: setExportImageUrl}
        }
    })

    const shareTierlistController = new ShareTierlistController({
        controller, states: {
            showState: {val: showShareTierlistModal, set: setShowShareTierlistModal}
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

    const {theme} = useTheme()


    return (
        <div>
            {showDeleteTemplateModal && <DeleteTemplateModal controller={deleteTemplateController}/>}
            {showExportImageModal && <ExportImageModal controller={exportImageController}/>}
            {showShareTierlistModal && <ShareTierlistModal controller={shareTierlistController}/>}
            {showImagesNamesModal && <Modal controller={showImageNamesController} title={Texts.SHOW_IMAGE_NAMES}
                                            message={Texts.SHOW_IMAGE_NAME_QUESTION}/>}

            <Helmet>
                <title>{`${tierlist?.name} - Tierlistmaker`}</title>
            </Helmet>

            <Box gridCenter id="t-c" className="select-none">


                <Card className="lg:w-5/6 mt-10 p-4 mb-8 w-11/12 overflow-hidden">

                    {initDone && tierlist && <Breadcrumb>
                        <BreadcrumbList className="cursor-pointer select-text">
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate(Paths.HOME)}>{Texts.HOMEPAGE}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    onClick={() => navigate(Paths.CATEGORIES)}>{Texts.CATEGORIES}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    onClick={() => navigate(Paths.CATEGORY.replace(":id", tierlist?.categoryId ?? ""))}>
                                    {Texts.SELECTION_CATEGORIES[tierlist.categoryId as keyof TextKeys["SELECTION_CATEGORIES"]]}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>}

                    <Box className="w-full mb-8">
                        {!initDone && <Skeleton className="w-[250px] h-[20px] rounded-full"/>}


                        {initDone &&
                            <Box className="mt-4 lg:flex lg:justify-between space-y-2">
                                <CardTitle onClick={async () => {
                                    await setClipboard(tierlist?.name ?? "")
                                    toast.success(Texts.COPY_SUCCESSFUL)
                                }}
                                           className="text-4xl font-bold text-text">{tierlist?.name} {Texts.TIER_LIST}</CardTitle>

                                {tierlist?.showImageNames && <Box className="lg:ml-3 hidden md:block">
                                    <div className="flex items-center">
                                        <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                                id="show-image-names"/>
                                        <Label className="ml-2"
                                               htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                                    </div>

                                </Box>}
                            </Box>}

                        {!initDone && <Skeleton className="lg:w-[550px] w-full h-[40px] rounded-full mt-4"/>}

                        <Box className="mt-4">
                            {initDone && <Box className="md:flex md:justify-between grid">
                                <CardDescription
                                    className="select-text text-lg w-full md:w-9/12">{tierlist?.description}</CardDescription>
                                <Box className="mt-2">
                                    <Button variant="secondary" onClick={controller.toggleVoteTierlist}
                                            disabled={isLoading || !initDone}>
                                        <Box flexCenter>
                                            <span className="mr-2 text-lg">{tierlistVotes}</span>

                                            {isTierlistVoted ?
                                                <ThumbsUp fill={theme === "dark" ? "white" : "black"}/>
                                                : <ThumbsUp/>}
                                        </Box>
                                    </Button>
                                </Box>


                            </Box>}

                            {!initDone && <Skeleton className="lg:w-[700px] w-full h-[28px] rounded-full"/>}
                        </Box>
                    </Box>


                    <Box id="tierlist" className={`bg-white dark:bg-[#020817] select-none`}>
                        <Box>
                            <Box id="tierlist-inner-container" className={"space-y-2 md:p-5"}>

                                {isExporting && <Box className="grid lg:flex lg:justify-between items-center">
                                    <h3 className="ml-5 text-3xl font-bold items-center">{tierlist?.name}</h3>
                                    <Box className="mb-5 flex justify-end items-center">
                                        <img src={Icon} alt="icon" className="w-16 h-16"/>


                                        <div className="flex items-center">
                                            <h3 style={{fontWeight: 900}}
                                                className="ml-5 title text-5xl leading-none tracking-tight text-gray-900 dark:text-white">
                                                Tierlistmaker.org
                                            </h3>
                                        </div>

                                    </Box></Box>


                                }

                                {initDone && tierlistRows.sort((a, b) => a.rowNumber - b.rowNumber).map((row, index) => {
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
                        </Box>
                    </Box>

                    <Box className="mt-8">
                        {initDone && <DroppableTier showImageNames={showImageNames}
                                                    row={{
                                                        id: "default",
                                                        name: "",
                                                        tierlistId: "",
                                                        rowNumber: -1,
                                                        clientId: ""
                                                    }}
                                                    handleDragStart={handleDragStart}
                                                    controller={controller}
                                                    hideLabel
                                                    color={""}
                        />}

                        {!initDone && <Skeleton className="w-full h-[200px] flex mb-2"/>}
                    </Box>


                    <Box className="grid items-center md:flex md:justify-center mt-8 w-full md:spacing-x-2">

                        <Button onClick={() => exportImageController.open()} variant="secondary"
                                className="py-7 px-5">
                            <Image className="mr-2 w-8 h-8"/>
                            <span className="text-xl font-bold"> {Texts.DOWNLOAD_IMAGE}</span>
                        </Button>

                        <Button onClick={() => shareTierlistController.open()} variant="secondary"
                                className="py-7 px-5 md:ml-5 mt-2 md:mt-0">
                            <Share className="mr-2 w-8 h-8"/>

                            <span className="text-xl font-bold"> {Texts.SHARE_YOUR_RANKING}</span>


                        </Button>


                    </Box>

                    <Box className="mt-8">

                        <label className="text-lg font-bold mb-2">{Texts.SHARE_TEMPLATE}</label>
                        <CopyToClipboard text={window.location.href}/>
                        <label className="text-lg font-bold mb-4">{Texts.SHARE_DIRECTLY}</label>
                        <Box flexSpaceBetween spacing={2} className="w-20 px-2">

                            <img onClick={controller.onShareTwitter} alt="X"
                                 className="cursor-pointer hover:scale-125 transition-transform" src={XLogo}
                                 height={40} width={40}/>
                            <img onClick={controller.onShareReddit} alt="Reddit"
                                 className="cursor-pointer hover:scale-125 transition-transform"
                                 src={RedditLogo} height={40} width={40}/>


                        </Box>
                    </Box>


                    <Box className="mt-5">
                        <Separator/>
                        <Box className="md:flex md:justify-start grid mt-2">

                            {initDone && isOwner && <>
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
                            </>}

                            <Button className="ml-3" disabled={isLoading || !initDone}
                                    onClick={controller.resetTierlist}>
                                {Texts.RESET_TIERLIST}
                            </Button>


                            {tierlist?.showImageNames && <div className="flex items-center md:hidden mt-4">
                                <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                        id="show-image-names"/>
                                <Label className="ml-2"
                                       htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                            </div>}


                        </Box>
                    </Box>

                </Card>

            </Box>
        </div>
    )

}