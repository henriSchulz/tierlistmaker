import {Box} from "@/components/ui/box";
import {DragEvent, useEffect, useState} from "react";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {useNavigate, useParams} from "react-router-dom";

import CustomButton from "@/components/custom/Button";
import Texts from "@/text/Texts";
import {Skeleton} from "@/components/ui/skeleton";

import DroppableTier from "@/pages/create-tierlist/components/DroppableTier";

import {Edit, Image, RotateCcw, Share, ThumbsUp, Trash} from "lucide-react";
import DeleteTemplateController from "@/pages/create-tierlist/features/delete-template/DeleteTemplateController";
import DeleteTemplateModal from "@/pages/create-tierlist/features/delete-template/DeleteTemplateModal";
import AuthenticationService from "@/services/AuthenticationService";
import {useAuthDone} from "@/App";

import CopyToClipboard from "@/components/CopyToClipboard";

import Icon from "@/assets/icon.png"
import ExportImageModalController from "@/pages/create-tierlist/features/export-image/ExportImageModalController";
import ExportImageModal from "@/pages/create-tierlist/features/export-image/ExportImageModal";

import ShareTierlistController from "@/pages/create-tierlist/features/share-tierlist/ShareTierlistController";
import ShareTierlistModal from "@/pages/create-tierlist/features/share-tierlist/ShareTierlistModal";
import {Helmet} from "react-helmet";

import MessageModalController from "@/controller/MessageModalController";
import {Modal} from "@/components/ui/message-modal";
import EditTemplateSheet from "@/features/edit-template/EditTemplateSheet";
import SignInSheet from "@/features/sign-in/SignInSheet";


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
    const [showExportImageModal, setShowExportImageModal] = useState<boolean>(false)
    const [showShareTierlistModal, setShowShareTierlistModal] = useState<boolean>(false)
    const [exportImageModalLoading, setExportImageModalLoading] = useState<boolean>(false)
    const [exportImageUrl, setExportImageUrl] = useState<string>("")
    const [showImageNames, setShowImageNames] = useState<boolean>(
        false
    )
    const [showEditTemplateSheet, setShowEditTemplateSheet] = useState<boolean>(false)
    const [showImagesNamesModal, setShowImagesNamesModal] = useState<boolean>(false)
    const [isExporting, setIsExporting] = useState<boolean>(false)
    const [showSignInSheet, setShowSignInSheet] = useState<boolean>(false)

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
            showImageNamesModalState: {val: showImagesNamesModal, set: setShowImagesNamesModal},
            showSignInSheetState: {val: showSignInSheet, set: setShowSignInSheet}
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


    return (<div>

            {
                showSignInSheet && <SignInSheet showState={{val: showSignInSheet, set: setShowSignInSheet}}/>
            }


            {showDeleteTemplateModal && <DeleteTemplateModal controller={deleteTemplateController}/>}
            {showExportImageModal && <ExportImageModal controller={exportImageController}/>}
            {showShareTierlistModal && <ShareTierlistModal controller={shareTierlistController}/>}
            {showImagesNamesModal && <Modal controller={showImageNamesController} title={Texts.SHOW_IMAGE_NAMES}
                                            message={Texts.SHOW_IMAGE_NAME_QUESTION}/>}

            {
                showEditTemplateSheet &&
                <EditTemplateSheet id={tierlist!.id}
                                   showState={{val: showEditTemplateSheet, set: setShowEditTemplateSheet}}/>
            }

            <Helmet>
                <title>{`${tierlist?.name} - Tierlistmaker`}</title>
            </Helmet>

            <Box gridCenter id="t-c" className="select-none">


                <div className="max-w-screen-lg w-full p-4 mb-8 overflow-hidden">

                    {/*{initDone && tierlist && <Breadcrumb>*/}
                    {/*    <BreadcrumbList className="cursor-pointer select-text">*/}
                    {/*        <BreadcrumbItem>*/}
                    {/*            <BreadcrumbLink onClick={() => navigate(Paths.HOME)}>{Texts.HOMEPAGE}</BreadcrumbLink>*/}
                    {/*        </BreadcrumbItem>*/}
                    {/*        <BreadcrumbSeparator/>*/}
                    {/*        <BreadcrumbItem>*/}
                    {/*            <BreadcrumbLink*/}
                    {/*                onClick={() => navigate(Paths.CATEGORIES)}>{Texts.CATEGORIES}</BreadcrumbLink>*/}
                    {/*        </BreadcrumbItem>*/}
                    {/*        <BreadcrumbSeparator/>*/}
                    {/*        <BreadcrumbItem>*/}
                    {/*            <BreadcrumbLink*/}
                    {/*                onClick={() => navigate(Paths.CATEGORY.replace(":id", tierlist?.categoryId ?? ""))}>*/}
                    {/*                {Texts.SELECTION_CATEGORIES[tierlist.categoryId as keyof TextKeys["SELECTION_CATEGORIES"]]}*/}
                    {/*            </BreadcrumbLink>*/}
                    {/*        </BreadcrumbItem>*/}
                    {/*    </BreadcrumbList>*/}
                    {/*</Breadcrumb>}*/}

                    {/*{!initDone && <Skeleton className="w-1/2 h-[20px] rounded-full"/>}*/}


                    <Box className="w-full mb-8">


                        <div className="mt-4">
                            <div>
                                {initDone && <p className="mb-3 font-semibold text-gray-400">{Texts.TIER_LIST}</p>}

                                {
                                    !initDone && <Skeleton className="mb-3 w-[70px] h-[20px] rounded-full"/>
                                }

                                <div className="lg:flex lg:justify-between space-y-2 items-center">
                                    {initDone &&
                                        <h1 className="flex items-start text-3xl font-bold leading-none text-gray-700">
                                            {tierlist?.name}
                                        </h1>}
                                    {!initDone && <Skeleton className="lg:w-[550px] w-full h-[40px] rounded-full"/>}


                                    <div className="md:flex md:justify-end grid gap-4">
                                        {initDone && isOwner && <>
                                            <CustomButton variant="tertiary" className="py-6"
                                                          disabled={isLoading || !initDone}
                                                          onClick={() => setShowEditTemplateSheet(true)}>
                                                <Edit className="mr-2"/>
                                                {Texts.EDIT}
                                            </CustomButton>

                                            <CustomButton variant="tertiary" className="py-6"
                                                          disabled={isLoading || !initDone}
                                                          onClick={deleteTemplateController.open}>
                                                <Trash className="mr-2"/>
                                                {Texts.DELETE}
                                            </CustomButton>
                                        </>}

                                        <CustomButton variant="tertiary" className="py-6"
                                                      disabled={isLoading || !initDone}
                                                      onClick={controller.resetTierlist}>
                                            <RotateCcw className="mr-2"/>
                                            {Texts.RESET_TIERLIST}
                                        </CustomButton>
                                    </div>
                                </div>

                            </div>

                            {/*{tierlist?.showImageNames && <Box className="lg:ml-3 hidden md:block">*/}
                            {/*    <div className="flex items-center">*/}
                            {/*        <Switch checked={showImageNames} onCheckedChange={setShowImageNames}*/}
                            {/*                id="show-image-names"/>*/}
                            {/*        <Label className="ml-2"*/}
                            {/*               htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>*/}
                            {/*    </div>*/}

                            {/*</Box>}*/}
                        </div>


                        <Box className="mt-4">
                            {initDone && <div className="md:flex md:justify-between grid items-center">


                                <p dangerouslySetInnerHTML={{ // find links in description and make them clickable
                                    __html: tierlist?.description?.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-primary font-bold" target="_blank">$1</a>') as string
                                }}
                                   className="mt-1 text-base font-medium text-gray-500 lg:text-xl">

                                </p>


                                <CustomButton className="mt-4 md:mt-0 md:ml-8" variant="secondary"
                                              onClick={controller.toggleVoteTierlist}
                                              disabled={isLoading || !initDone}>
                                    <div className="flex">
                                        <span className="mr-2 text-lg">{tierlistVotes}</span>


                                        <ThumbsUp className={isTierlistVoted ? "fill-blue-500" : ""}/>

                                    </div>
                                </CustomButton>


                            </div>}

                            {!initDone && <Skeleton className="lg:w-[700px] w-full h-[28px] rounded-full"/>}
                        </Box>
                    </Box>


                    <Box id="tierlist" className={`bg-white dark:bg-[#020817] select-none`}>
                        <Box>
                            <Box id="tierlist-inner-container" className={"space-y-2"}>

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

                        <CustomButton onClick={() => exportImageController.open()} variant="secondary"
                                      className="py-7 px-5">
                            <Image className="mr-2 w-8 h-8"/>
                            <span className="text-xl font-bold"> {Texts.DOWNLOAD_IMAGE}</span>
                        </CustomButton>

                        <CustomButton onClick={() => shareTierlistController.open()} variant="secondary"
                                      className="py-7 px-5 md:ml-5 mt-2 md:mt-0">
                            <Share className="mr-2 w-8 h-8"/>

                            <span className="text-xl font-bold"> {Texts.SHARE_YOUR_RANKING}</span>


                        </CustomButton>


                    </Box>

                    <Box className="mt-16 w-full">

                        <p className="text-2xl font-bold leading-none text-gray-700 mb-4">{Texts.SHARE_TEMPLATE}</p>
                        <div className="grid md:flex items-center md:justify-between w-full">
                            <CopyToClipboard text={window.location.href}/>

                            {/*<div className="flex justify-between mt-6 px-2 gap-10 flex">*/}
                            {/*    <CustomButton variant="icon">*/}
                            {/*        <img onClick={controller.onShareTwitter} alt="X"*/}
                            {/*             src={XLogo}*/}
                            {/*             height={40} width={40}/>*/}
                            {/*    </CustomButton>*/}
                            {/*    <CustomButton variant="icon">*/}
                            {/*        <img onClick={controller.onShareReddit} alt="Reddit"*/}
                            {/*             src={RedditLogo}*/}
                            {/*             height={40} width={40}/>*/}
                            {/*    </CustomButton>*/}

                            {/*</div>*/}
                        </div>
                    </Box>


                </div>

            </Box>
        </div>
    )

}