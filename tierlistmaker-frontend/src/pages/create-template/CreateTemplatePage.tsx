import {Box} from "@/components/ui/box";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Texts from "@/text/Texts";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {cn} from "@/lib/utils"
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import CreateTemplatePageController from "@/pages/create-template/CreateTemplatePageController";
import {Button, buttonVariants} from "@/components/ui/button";
import {Image as LImage, Minus, Plus} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch"
import {useNavigate, useSearchParams} from "react-router-dom";

import UploadImageItem from "@/pages/create-template/components/UploadImageItem";
import {useAuthDone} from "@/App";
import GoogleImageSearchController from "@/features/google-images-search/GoogleImageSearchController";
import GoogleImageSearchModal from "@/features/google-images-search/GoogleImageSearchModal";

import Google from "@/assets/google.svg";
import {urlToFile} from "@/utils";
import {Helmet} from "react-helmet";


export default function () {
    const [searchParams, setSearchParams] = useSearchParams()

    const [numberOfRows, setNumberOfRows] = useState(CreateTemplatePageController.DEFAULT_NUMBER_OF_ROWS)
    const [step, setStep] = useState(0)
    const [templateName, setTemplateName] = useState(
        localStorage.getItem("templateName") || ""
    )
    const [templateCategory, setTemplateCategory] = useState<string | undefined>(
        searchParams.get("c") || localStorage.getItem("templateCategory") || undefined
    )
    const [templateCoverImage, setTemplateCoverImage] = useState<File | null>(null)
    const [templateImages, setTemplateImages] = useState<File[]>([])
    const [templateDescription, setTemplateDescription] = useState(
        localStorage.getItem("templateDescription") || ""
    )
    const [isPublicTierlist, setIsPublicTierlist] = useState(true)
    const [showImageNames, setShowImageNames] = useState(false)

    const [dragTemplateImageActive, setDragTemplateImageActive] = useState(false)
    const [dragCoverImageActive, setDragCoverImageActive] = useState(false)
    const [showSearchGoogleImagesModal, setShowSearchGoogleImagesModal] = useState(false)
    const [showSearchGoogleImagesModal2, setShowSearchGoogleImagesModal2] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [currentImages, setCurrentImages] = useState<{ src: string, title: string }[]>([])
    const [selectedImages, setSelectedImages] = useState<{ src: string, title: string }[]>([])

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const controller = new CreateTemplatePageController({
        states: {
            stepState: {val: step, set: setStep},
            numberOfRowsState: {val: numberOfRows, set: setNumberOfRows},
            templateNameState: {val: templateName, set: setTemplateName},
            templateCategoryState: {val: templateCategory, set: setTemplateCategory},
            templateCoverImageState: {val: templateCoverImage, set: setTemplateCoverImage},
            templateImagesState: {val: templateImages, set: setTemplateImages},
            templateDescriptionState: {val: templateDescription, set: setTemplateDescription},
            isPublicTierlistState: {val: isPublicTierlist, set: setIsPublicTierlist},
            dragTemplateImageActiveState: {val: dragTemplateImageActive, set: setDragTemplateImageActive},
            dragCoverImageActiveState: {val: dragCoverImageActive, set: setDragCoverImageActive},
            loadingState: {val: loading, set: setLoading},
            showImageNamesState: {val: showImageNames, set: setShowImageNames}
        },
        searchParams: {val: searchParams, set: setSearchParams},
        navigate
    })

    const googleImageSearchController = new GoogleImageSearchController({
        multiple: false,
        defaultSearch: templateName,
        setImages: async images => {
            const file = await urlToFile(images[0].src, images[0].title)
            setTemplateCoverImage(file)
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
        defaultSearch: templateName,
        setImages: async images => {
            const files = await Promise.all(images.map(async image => await urlToFile(image.src, image.title)))
            setTemplateImages(prev => [...prev, ...files])
        },
        states: {
            showState: {val: showSearchGoogleImagesModal2, set: setShowSearchGoogleImagesModal2},
            searchInput: {val: searchInput, set: setSearchInput},
            currentImages: {val: currentImages, set: setCurrentImages},
            loadingState: {val: loading, set: setLoading},
            selectedImagesState: {val: selectedImages, set: setSelectedImages}
        }
    })

    const authDone = useAuthDone()


    useEffect(() => {
        if (!authDone) return
        controller.init()
    }, [authDone])

    useEffect(() => {
        localStorage.setItem("templateName", templateName)
    }, [templateName])

    useEffect(() => {
        localStorage.setItem("templateDescription", templateDescription)
    }, [templateDescription])

    useEffect(() => {

        if (Object.keys(Texts.SELECTION_CATEGORIES).includes(templateCategory || "")) {
            localStorage.setItem("templateCategory", templateCategory || "")
        } else {
            setTemplateCategory(undefined)
        }


    }, [templateCategory])


    return <Box gridCenter>

        <Helmet>
            <title>
                {Texts.CREATE_NEW_TEMPLATE} - Tierlistmaker
            </title>
        </Helmet>


        {showSearchGoogleImagesModal && <GoogleImageSearchModal controller={googleImageSearchController}/>}
        {showSearchGoogleImagesModal2 && <GoogleImageSearchModal controller={googleImageSearchController2}/>}

        <Card className="mt-10 w-11/12 lg:w-2/3 mb-8">
            <CardHeader>
                <CardTitle>{Texts.CREATE_NEW_TEMPLATE}</CardTitle>
                <CardDescription>{Texts.CREATE_NEW_TEMPLATE_DESCRIPTION}</CardDescription>
            </CardHeader>
            <CardContent>

                {step === 0 && <Box>


                    <div className="flex items-center space-x-2">
                        <Switch checked={isPublicTierlist} onCheckedChange={setIsPublicTierlist}
                                id="public-tierlist"/>
                        <Label htmlFor="public-tierlist">{Texts.PUBLIC_TEMPLATE + "?"}</Label>
                    </div>


                    <Box className="mt-4">
                        <Label htmlFor="template-name">{Texts.TEMPLATE_NAME}</Label>
                        <Input value={templateName}
                               onChange={e => setTemplateName(e.target.value)}
                               id="template-name"
                               placeholder={Texts.TEMPLATE_NAME_EXAMPLE}/>
                    </Box>
                    <Select value={templateCategory} onValueChange={value => setTemplateCategory(value)}>
                        <Box className="mt-M4">
                            <Label htmlFor="category">{Texts.CATEGORY}</Label>
                            <SelectTrigger>
                                <SelectValue placeholder={Texts.SELECT_CATEGORY}/>
                            </SelectTrigger>
                        </Box>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{Texts.CATEGORIES}</SelectLabel>
                                {Object.entries(Texts.SELECTION_CATEGORIES).map(([key, value], index) => <SelectItem
                                    value={key}
                                    key={index}>{value}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Box className="mt-4">
                        <Label htmlFor="description">{Texts.TEMPLATE_DESCRIPTION}</Label>
                        <Textarea value={templateDescription}
                                  onChange={e => setTemplateDescription(e.target.value)}
                                  id="description"
                                  placeholder={Texts.TEMPLATE_DESCRIPTION_EXAMPLE}/>

                    </Box>
                    <Button onClick={controller.onContinue} className="mt-4 w-full">
                        {Texts.CONTINUE}
                    </Button>

                </Box>}


                {step === 1 && <Box>
                    <Box className="mt-4">
                        <Label htmlFor="cover-image">{Texts.COVER_IMAGE}</Label>
                        <div className="flex justify-center items-center">
                            <Input accept="image/png, image/jpeg" placeholder="COVER IMAGES"

                                   onChange={e => setTemplateCoverImage(e.target.files?.[0] || null)} id="cover-image"
                                   type="file"/>

                            <Button variant="secondary" onClick={googleImageSearchController.open}
                                    className="ml-2">
                                <img src={Google} height={30} width={30}/>
                            </Button>
                        </div>

                    </Box>

                    <Box className="mt-4">
                        <h3 className="text-lg font-bold">{Texts.SELECT_IMAGES_TEXT}:</h3>
                        <ul className="list-disc">
                            <li className="ml-8">{Texts.CHOOSE_ALL_IMAGES_AT_ONCE}</li>
                            <li className="ml-8">{Texts.USE_CONSISTENT_IMAGES}</li>
                            <li className="ml-8">{Texts.MINIMUM_IMAGE_AMOUNT}</li>
                            <li className="ml-8">
                                {Texts.IMAGE_NAME_INFO}
                            </li>
                        </ul>

                        <div className="flex items-center space-x-2 mt-2 ml-8">
                            <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                    id="show-image-names"/>
                            <Label htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                        </div>


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
                                {templateImages.map((image, index) => (
                                    <UploadImageItem key={index} image={image}
                                                     deleteItem={() => {
                                                         setTemplateImages(prev => prev.filter((_, i) => i !== index))
                                                     }
                                                     }/>
                                ))}


                            </Box>
                        </Box>


                        <input style={{display: "none"}} accept=".png, .jpg, .jpeg, .gif"
                               onChange={controller.onFileUploadImageChange}
                               className="mt-4"
                               id="template-images"
                               type="file" multiple/>


                    </Box>
                    <Button onClick={controller.onContinue2} className="mt-4 w-full">
                        {Texts.CONTINUE}
                    </Button>
                </Box>}

                {step === 2 && <Box className="mt-4">
                    <h3 className="text-lg font-bold">{Texts.ROW_NAMES}:</h3>

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

                    {Array.from({length: numberOfRows}, (_, i) => <Box key={i} className="mt-2">
                        <Input id={`row-${i}`} placeholder={CreateTemplatePageController.DEFAULT_ROW_NAMES[i]}/>
                    </Box>)}

                    <Button disabled={loading} onClick={controller.onSubmit} className="mt-4 w-full">
                        {Texts.CREATE_TEMPLATE}
                    </Button>


                </Box>}
            </CardContent>

        </Card>


    </Box>
}