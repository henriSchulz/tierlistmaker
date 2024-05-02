import {Box} from "@/components/ui/box";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Texts from "@/text/Texts";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

import {Textarea} from "@/components/ui/textarea";
import {useEffect, useState} from "react";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import EditTemplateController from "@/pages/edit-template/EditTemplateController";
import Tierlist from "@/types/dbmodel/Tierlist";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Button, buttonVariants} from "@/components/ui/button";
import EditTierlistItem from "@/pages/edit-template/components/EditTierlistItem";
import CreateTemplatePageController from "@/pages/create-template/CreateTemplatePageController";
import {Image as LImage, Minus, Plus} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {PathUtils} from "@/Paths";
import UploadImageItem from "@/pages/create-template/components/UploadImageItem";
import {useAuthDone} from "@/App";
import GoogleImageSearchModal from "@/features/google-images-search/GoogleImageSearchModal";
import GoogleImageSearchController from "@/features/google-images-search/GoogleImageSearchController";
import {urlToFile} from "@/utils";
import Google from "@/assets/google.svg";
import {cn} from "@/lib/utils";


export default function () {
    const {id} = useParams()

    const [tierlist, setTierlist] = useState<Tierlist | null>(null)
    const [loading, setLoading] = useState(false)
    const [tierlistName, setTierlistName] = useState("")
    const [tierlistDescription, setTierlistDescription] = useState("")
    const [isPublicTierlist, setIsPublicTierlist] = useState(false)
    const [tierlistItems, setTierlistItems] = useState<TierlistItem[]>([])
    const [tierlistRows, setTierlistRows] = useState<TierlistRow[]>([])
    const [tierlistItemIdsToDelete, setTierlistItemIdsToDelete] = useState<string[]>([])
    const [templateCoverImageToUpdate, setTemplateCoverImageToUpdate] = useState<File | null>(null)
    const [templateImagesToAdd, setTemplateImagesToAdd] = useState<File[]>([])
    const [searchParams, setSearchParams] = useSearchParams();
    const [numberOfRows, setNumberOfRows] = useState(0)
    const [initDone, setInitDone] = useState(false)
    const [showSearchGoogleImagesModal, setShowSearchGoogleImagesModal] = useState(false)
    const [showSearchGoogleImagesModal2, setShowSearchGoogleImagesModal2] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [currentImages, setCurrentImages] = useState<{ src: string, title: string }[]>([])
    const [selectedImages, setSelectedImages] = useState<{ src: string, title: string }[]>([])

    const navigate = useNavigate()
    const authDone = useAuthDone()

    const controller = new EditTemplateController({
        states: {
            loadingState: {val: loading, set: setLoading},
            tierlistNameState: {val: tierlistName, set: setTierlistName},
            tierlistDescriptionState: {val: tierlistDescription, set: setTierlistDescription},
            publicTemplateState: {val: isPublicTierlist, set: setIsPublicTierlist},
            templateCoverImageToUpdateState: {val: templateCoverImageToUpdate, set: setTemplateCoverImageToUpdate},
            templateImagesToAddState: {val: templateImagesToAdd, set: setTemplateImagesToAdd},
            tierlistItemsState: {val: tierlistItems, set: setTierlistItems},
            tierlistRowsState: {val: tierlistRows, set: setTierlistRows},
            tierlistItemIdsToDeleteState: {val: tierlistItemIdsToDelete, set: setTierlistItemIdsToDelete},
            tierlistState: {val: tierlist, set: setTierlist},
            initDoneState: {val: initDone, set: setInitDone},
            numberOfRowsState: {val: numberOfRows, set: setNumberOfRows}
        },
        navigate
    })

    useEffect(() => {
        if (!authDone) return
        controller.init(id)
    }, [authDone, id])

    const googleImageSearchController = new GoogleImageSearchController({
        multiple: false,
        defaultSearch: tierlist?.name,
        setImages: async images => {
            const file = await urlToFile(images[0].src, images[0].title)
            setTemplateCoverImageToUpdate(file)
            // set the file to the cover-image file input

            const input = document.getElementById("cover-image") as HTMLInputElement

            const files = new DataTransfer()
            files.items.add(file)
            input.files = files.files
        },
        states: {
            showState: {val: showSearchGoogleImagesModal, set: setShowSearchGoogleImagesModal},
            searchInput: {val: searchInput, set: setSearchInput},
            currentImages: {val: currentImages, set: setCurrentImages},
            loadingState: {val: loading, set: setLoading},
            selectedImagesState: {val: selectedImages, set: setSelectedImages}
        }
    })

    const googleImageSearchController2 = new GoogleImageSearchController({
        multiple: true,
        defaultSearch: tierlist?.name,
        setImages: async images => {
            const files = await Promise.all(images.map(async image => await urlToFile(image.src, image.title)))
            setTemplateImagesToAdd(prev => [...prev, ...files])
            setTemplateImagesToAdd(prev => [...prev, ...files])
        },
        states: {
            showState: {val: showSearchGoogleImagesModal2, set: setShowSearchGoogleImagesModal2},
            searchInput: {val: searchInput, set: setSearchInput},
            currentImages: {val: currentImages, set: setCurrentImages},
            loadingState: {val: loading, set: setLoading},
            selectedImagesState: {val: selectedImages, set: setSelectedImages}
        }
    })

    const updateSearchParams = (tab: string) => {
        const searchParams = new URLSearchParams()
        searchParams.set("tab", tab)

        setSearchParams(searchParams)
    }


    return <Box className="w-full">


        {showSearchGoogleImagesModal && <GoogleImageSearchModal controller={googleImageSearchController}/>}
        {showSearchGoogleImagesModal2 && <GoogleImageSearchModal controller={googleImageSearchController2}/>}


        <Tabs onValueChange={updateSearchParams} defaultValue={searchParams.get("tab") ?? "1"}
              className="w-full mt-3 grid place-items-center">
            <TabsList className="grid w-11/12 lg:w-2/3 grid-cols-3">
                <TabsTrigger value="1">{Texts.GENERAL}</TabsTrigger>
                <TabsTrigger value="2">{Texts.IMAGES}</TabsTrigger>
                <TabsTrigger value="3">{Texts.TIERS}</TabsTrigger>
            </TabsList>
            <TabsContent className="w-full " value="1">
                <Box gridCenter>
                    <Card className="mt-2 w-11/12 lg:w-2/3 mb-8">
                        <CardHeader>
                            <Box flexSpaceBetween>
                                <Box>
                                    <CardTitle>{Texts.EDIT_TEMPLATE}</CardTitle>
                                    <CardDescription>{Texts.EDIT_TEMPLATE_DESCRIPTION}</CardDescription>
                                </Box>

                                <Box>
                                    <Button className="ml-2" disabled={!initDone}
                                            onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist!))}

                                    >{Texts.GO_BACK}</Button>
                                </Box>
                            </Box>
                        </CardHeader>

                        <CardContent>
                            {initDone && <div className="flex items-center space-x-2">
                                <Switch checked={isPublicTierlist} onCheckedChange={setIsPublicTierlist}
                                        id="public-tierlist"/>
                                <Label htmlFor="public-tierlist">{Texts.PUBLIC_TEMPLATE + "?"}</Label>
                            </div>}

                            {!initDone && <Skeleton className="h-[35px] w-[163px]"/>}


                            <Box className="mt-4">
                                {initDone && <>
                                    <Label htmlFor="template-name">{Texts.TEMPLATE_NAME}</Label>
                                    <Input value={tierlistName}
                                           onChange={e => setTierlistName(e.target.value)}
                                           id="template-name"
                                           placeholder={Texts.TEMPLATE_NAME_EXAMPLE}/></>}
                                {!initDone && <Skeleton className="h-[53px] w-full"/>}
                            </Box>


                            <Box className="mt-4">
                                {initDone && <>
                                    <Label htmlFor="description">{Texts.TEMPLATE_DESCRIPTION}</Label>
                                    <Textarea value={tierlistDescription}

                                              onChange={e => setTierlistDescription(e.target.value)}
                                              id="description"
                                              placeholder={Texts.TEMPLATE_DESCRIPTION_EXAMPLE}/></>}

                                {!initDone && <Skeleton className="h-[104px] w-full"/>}
                            </Box>

                            <Button disabled={!initDone || loading} className="w-full mt-4"
                                    onClick={controller.onUpdateGeneralInformation}>
                                {Texts.SAVE_CHANGES}
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </TabsContent>

            <TabsContent className="w-full" value="2">

                <Box gridCenter>
                    <Card className="mt-2 w-11/12 lg:w-2/3 mb-8">

                        <CardHeader>
                            <Box flexSpaceBetween>
                                <Box>
                                    <CardTitle>{Texts.EDIT_TEMPLATE}</CardTitle>
                                    <CardDescription>{Texts.EDIT_TEMPLATE_DESCRIPTION}</CardDescription>
                                </Box>

                                <Box>
                                    <Button disabled={!initDone}
                                            onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist!))}

                                    >{Texts.GO_BACK}</Button>
                                </Box>
                            </Box>
                        </CardHeader>

                        <CardContent>
                            <Box className="">
                                <Label htmlFor="cover-image">{Texts.COVER_IMAGE}</Label>
                                <div className="flex justify-center items-center">
                                    <Input accept="image/png, image/jpeg" placeholder="COVER IMAGES"

                                           onChange={e => setTemplateCoverImageToUpdate(e.target.files?.[0] || null)}
                                           id="cover-image"
                                           type="file"/>

                                    <Button variant="secondary" onClick={googleImageSearchController.open}
                                            className="ml-2">
                                        <img src={Google} height={30} width={30}/>
                                    </Button>
                                </div>
                            </Box>
                            <Box className="mt-4">
                                <h3 className="text-xl font-bold">{Texts.CURRENT_TEMPLATE_IMAGES}</h3>

                                <Box className="mt-4 flex flex-wrap">


                                    {initDone && tierlistItems.filter(item => !tierlistItemIdsToDelete.includes(item.id)).map((item, index) => (
                                        <EditTierlistItem key={index} item={item} controller={controller}/>
                                    ))}

                                    {!initDone && Array.from({length: 5}, (_, index) => (
                                        <Skeleton key={index}
                                                  className={`h-[60px] w-[60px]`}/>
                                    ))}

                                </Box>

                                <Box className="mt-4">
                                    <h3 className="text-lg font-bold">{Texts.SELECT_IMAGES_TEXT_ADD}:</h3>
                                    <ul className="list-disc">
                                        <li className="ml-8">{Texts.CHOOSE_ALL_IMAGES_AT_ONCE}</li>
                                        <li className="ml-8">{Texts.USE_CONSISTENT_IMAGES}</li>
                                        <li className="ml-8">{Texts.IMAGE_NAME_INFO}</li>
                                    </ul>

                                    <Box>
                                        <div className="flex justify-center items-center mt-3">
                                            <div
                                                onClick={() => document.getElementById("template-images")?.click()}
                                                className={cn(buttonVariants({
                                                    variant: "secondary",
                                                    size: "default"
                                                }), "transition w-full")}>
                                                <LImage className="mr-2"/>
                                                {Texts.UPLOAD_IMAGES}

                                            </div>

                                            <Button variant="secondary" onClick={googleImageSearchController2.open}
                                                    className="ml-2">
                                                <img src={Google} height={30} width={30}/>
                                            </Button>

                                        </div>

                                        <Box className="flex flex-wrap mt-3">
                                            {templateImagesToAdd.map((image, index) => (
                                                <UploadImageItem key={index} image={image}
                                                                 deleteItem={() => {
                                                                     setTemplateImagesToAdd(prev => prev.filter((_, i) => i !== index))
                                                                 }
                                                                 }/>
                                            ))}
                                        </Box>

                                        <input style={{display: "none"}} accept=".png, .jpg, .jpeg, .gif"
                                               onChange={controller.onFileUploadImageChange}
                                               className="mt-4"
                                               id="template-images"
                                               type="file" multiple/>
                                    </Box>
                                </Box>

                            </Box>

                            <Button onClick={controller.onUpdateImages} disabled={!initDone || loading}
                                    className="w-full mt-4">
                                {Texts.SAVE_CHANGES}
                            </Button>
                        </CardContent>

                    </Card>
                </Box>

            </TabsContent>

            <TabsContent className="w-full" value="3">

                <Box gridCenter>
                    <Card className="mt-2 w-11/12 lg:w-2/3 mb-8">
                        <CardHeader>
                            <Box flexSpaceBetween>
                                <Box>
                                    <CardTitle>{Texts.EDIT_TEMPLATE}</CardTitle>
                                    <CardDescription>{Texts.EDIT_TEMPLATE_DESCRIPTION}</CardDescription>
                                </Box>

                                <Box>
                                    <Button disabled={!initDone}
                                            onClick={() => navigate(PathUtils.getCreateTierlistPath(tierlist!))}

                                    >{Texts.GO_BACK}</Button>
                                </Box>
                            </Box>
                        </CardHeader>
                        <CardContent>
                            <Box className="">
                                <h3 className="text-lg font-bold">{Texts.ROW_NAMES}</h3>
                            </Box>

                            <Box flexCenter spacing={1} className="mt-4">
                                <Button onClick={() => controller.addRow()} className="w-full">
                                    <Plus className="mr-2"/>
                                    {Texts.ADD_ROW}
                                </Button>
                                <Button onClick={() => controller.removeRow()} className="w-full">
                                    <Minus className="mr-2"/>
                                    {Texts.REMOVE_ROW}
                                </Button>
                            </Box>

                            <Box className="mt-4">
                                {initDone && Array.from({length: numberOfRows}, (_, index) => (
                                    <Box key={index} className="mt-2">
                                        <Input defaultValue={tierlistRows[index]?.name ?? ""} id={`row-${index}`}
                                               placeholder={CreateTemplatePageController.DEFAULT_ROW_NAMES[index]}/>
                                    </Box>
                                ))}

                                {!initDone && Array.from({length: 5}, (_, index) => (
                                    <Skeleton key={index} className="h-[40px] w-full mt-2"/>
                                ))}
                            </Box>

                            <Button onClick={controller.onUpdateRows} disabled={!initDone || loading}
                                    className="w-full mt-4">
                                {Texts.SAVE_CHANGES}
                            </Button>

                        </CardContent>

                    </Card>
                </Box>


            </TabsContent>

        </Tabs>
    </Box>


}