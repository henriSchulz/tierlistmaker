import State from "@/types/State";
import CustomButton from "@/components/custom/Button"
import Texts from "@/text/Texts";
import {ArrowRight, BadgePlus, Image, Plus, Trash} from "lucide-react";
import {motion} from "framer-motion";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CreateTemplateController from "@/features/create-template/CreateTemplateController";
// import GoogleImageSearchController from "@/features/google-images-search/GoogleImageSearchController";
// import {urlToFile} from "@/utils";
import {useAuthDone} from "@/App";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Box} from "@/components/ui/box";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import UploadImageItem from "@/features/create-template/components/UploadImageItem";


interface CreateTemplateSheetProps {
    showState: State<boolean>
}

export default function ({showState}: CreateTemplateSheetProps) {
    const [searchParams, setSearchParams] = useSearchParams()

    const [numberOfRows, setNumberOfRows] = useState(CreateTemplateController.DEFAULT_NUMBER_OF_ROWS)
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
    const [rowNames, setRowNames] = useState<string[]>([])
    // const [showSearchGoogleImagesModal, setShowSearchGoogleImagesModal] = useState(false)
    // const [showSearchGoogleImagesModal2, setShowSearchGoogleImagesModal2] = useState(false)
    // const [searchInput, setSearchInput] = useState("")
    // const [currentImages, setCurrentImages] = useState<{ src: string, title: string }[]>([])
    // const [selectedImages, setSelectedImages] = useState<{ src: string, title: string }[]>([])

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const controller = new CreateTemplateController({
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
            showImageNamesState: {val: showImageNames, set: setShowImageNames},
            rowNamesState: {val: rowNames, set: setRowNames}
        },
        searchParams: {val: searchParams, set: setSearchParams},
        navigate
    })

    // const googleImageSearchController = new GoogleImageSearchController({
    //     multiple: false,
    //     defaultSearch: templateName,
    //     setImages: async images => {
    //         const file = await urlToFile(images[0].src, images[0].title)
    //         setTemplateCoverImage(file)
    //         // set the file to the cover-image file input
    //
    //         const input = document.getElementById("cover-image") as HTMLInputElement
    //
    //         const files = new DataTransfer()
    //         files.items.add(file)
    //         input.files = files.files
    //     },
    //     states: {
    //         showState: {val: showSearchGoogleImagesModal, set: setShowSearchGoogleImagesModal},
    //         searchInput: {val: searchInput, set: setSearchInput},
    //         currentImages: {val: currentImages, set: setCurrentImages},
    //         loadingState: {val: loading, set: setLoading},
    //         selectedImagesState: {val: selectedImages, set: setSelectedImages}
    //     }
    // })

    // const googleImageSearchController2 = new GoogleImageSearchController({
    //     multiple: true,
    //     defaultSearch: templateName,
    //     setImages: async images => {
    //         const files = await Promise.all(images.map(async image => await urlToFile(image.src, image.title)))
    //         setTemplateImages(prev => [...prev, ...files])
    //     },
    //     states: {
    //         showState: {val: showSearchGoogleImagesModal2, set: setShowSearchGoogleImagesModal2},
    //         searchInput: {val: searchInput, set: setSearchInput},
    //         currentImages: {val: currentImages, set: setCurrentImages},
    //         loadingState: {val: loading, set: setLoading},
    //         selectedImagesState: {val: selectedImages, set: setSelectedImages}
    //     }
    // })

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


    const steps = [
        {
            subtitle: Texts.CREATE_A_NEW_TEMPLATE_DESCRIPTION
        }, {
            subtitle: Texts.TEMPLATE_DESCRIPTION_SUBTITLE
        }, {
            subtitle: Texts.TEMPLATE_CATEGORY_SUBTITLE
        }, {
            subtitle: Texts.PUBLIC_OR_PRIVATE_SUBTITLE
        }, {
            subtitle: Texts.SELECT_A_COVER_IMAGE_SUBTITLE
        }, {
            subtitle: Texts.SELECT_IMAGES_TEXT
        }, {
            subtitle: Texts.ENTER_ROW_NAMES_SUBTITLE
        }, {
            subtitle: Texts.SURE_TO_CREATE_TEMPLATE
        }


    ]

    return <motion.div
        initial={{
            opacity: 0,
            scale: 0.9
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}
        exit={{opacity: 0, scale: 0.9}}
        className="create-template-sheet">
        <CustomButton onClick={() => showState?.set(false)} className="absolute right-4 top-4 lg:right-10 lg:top-10">
            Close
        </CustomButton>

        <motion.main layout layoutId="create-template-main"
                     className="mt-40 flex flex-col items-center justify-center">
            <div className="mb-12 text-center">
                <h1 className="text-2xl font-bold md:text-3xl">
                    {Texts.CREATE_A_NEW_TEMPLATE}
                </h1>
                <p className="mt-1 text-base font-medium text-gray-500 lg:text-xl">
                    {steps[step].subtitle}
                </p>
            </div>
            <div className="w-full max-w-xl">

                {step === 0 && <div
                    className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                    {templateName.trim().length === 0 && <div
                        className="absolute select-none px-2 text-xl font-bold text-gray-800/20 md:px-4 md:text-3xl"
                    >{Texts.TEMPLATE_NAME_EXAMPLE}
                    </div>}
                    <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)}
                           className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-2 md:px-4 md:text-3xl"
                    />
                </div>}


                {step === 1 && <div
                    className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                    {templateDescription.trim().length === 0 && <div
                        className="absolute select-none px-2 text-xl font-bold text-gray-800/20 md:px-4 md:text-3xl"
                    >{Texts.TEMPLATE_DESCRIPTION_EXAMPLE}
                    </div>}
                    <textarea rows={3} value={templateDescription}
                              onChange={e => setTemplateDescription(e.target.value)}
                              className="resize-none z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-2 md:px-4 md:text-3xl"
                    />
                </div>}

                {step === 2 && <div>
                    <Select value={templateCategory} onValueChange={value => setTemplateCategory(value)}>
                        <Box className="mt-M4">
                            <SelectTrigger
                                className="flex py-8 items-center border border-gray-200 bg-gray-100  px-4 font-bold text-3xl rounded-2xl outline-none">
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
                </div>}

                {step === 3 && <div>
                    <div className="flex space-x-2 items-center justify-center">

                        <CustomButton className="w-full py-6" onClick={() => setIsPublicTierlist(true)}
                                      variant={isPublicTierlist ? "secondary" : "tertiary"}>
                            {Texts.PUBLIC}
                        </CustomButton>

                        <CustomButton className="w-full py-6" onClick={() => setIsPublicTierlist(false)}
                                      variant={!isPublicTierlist ? "secondary" : "tertiary"}>
                            {Texts.PRIVATE}

                        </CustomButton>

                    </div>
                </div>}

                {step === 4 && <div
                    className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                    <CustomButton onClick={() => document.getElementById("cover-image")?.click()}
                                  variant="tertiary"
                                  className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-5 md:px-4 md:text-3xl"
                    >

                        <Image className="w-8 h-8 mr-4"/>
                        {!templateCoverImage && Texts.SELECT_A_COVER_IMAGE}
                        {templateCoverImage &&
                            <span className="overflow-hidden whitespace-nowrap w-[80%] text-lg md:text-2xl"

                            >{templateCoverImage.name}</span>}
                    </CustomButton>

                    <input type="file" id="cover-image" accept="image/*" onChange={e => {
                        if (e.target.files) {
                            setTemplateCoverImage(e.target.files[0])
                        }
                    }} className="hidden"/>
                </div>}

                {step === 5 && <div>

                    <ul className="list-disc text-gray-500 text-base">
                        <li className="ml-8">{Texts.CHOOSE_ALL_IMAGES_AT_ONCE}</li>
                        <li className="ml-8">{Texts.USE_CONSISTENT_IMAGES}</li>
                        <li className="ml-8">{Texts.MINIMUM_IMAGE_AMOUNT}</li>
                        <li className="ml-8">
                            {Texts.IMAGE_NAME_INFO}
                        </li>
                    </ul>

                    <div className="flex items-center space-x-2 mt-4 mb-12 ml-8">
                        <Switch checked={showImageNames} onCheckedChange={setShowImageNames}
                                id="show-image-names"/>
                        <Label htmlFor="show-image-names">{Texts.SHOW_IMAGE_NAMES + "?"}</Label>
                    </div>

                    <div
                        className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                        <CustomButton onClick={() => document.getElementById("template-images")?.click()}
                                      variant="tertiary"
                                      className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-5 md:px-4 md:text-3xl"
                        >

                            <Image className="w-8 h-8 mr-4"/>
                            {Texts.SELECT_IMAGES}

                        </CustomButton>

                        <input multiple type="file" id="template-images" accept="image/*"
                               onChange={controller.onFileUploadImageChange} className="hidden"/>
                    </div>

                    <div className="flex flex-wrap mt-3">
                        {templateImages.map((image, index) => (
                            <UploadImageItem key={index} image={image}
                                             deleteItem={() => {
                                                 setTemplateImages(prev => prev.filter((_, i) => i !== index))
                                             }
                                             }/>
                        ))}
                    </div>
                </div>}

                {step === 6 && <div>

                    <motion.div layout layoutId="rows" className="space-y-2">
                        <CustomButton disabled={numberOfRows === 8} onClick={() => controller.addRow()}
                                      variant="secondary"
                                      className="w-full mb-6">
                            <Plus className="mr-2"/>
                            {Texts.ADD_ROW}
                        </CustomButton>


                        {Array.from({length: numberOfRows}, (_, i) => <div className="flex" key={i}>
                            <motion.div layout layoutId={"layout-row-" + i} transition={{duration: 0.5}}
                                        initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.9}}
                                        className="relative w-full flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                                <input id={`row-${i}`}
                                       defaultValue={CreateTemplateController.DEFAULT_ROW_NAMES[i]}
                                       type="text"
                                       className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-1 md:px-4 md:text-3xl"
                                />
                            </motion.div>

                            {i > 4 && <CustomButton variant="secondary" className="ml-4"
                                                    onClick={() => controller.removeRow(i)}>
                                <Trash/>
                            </CustomButton>}

                        </div>)}

                    </motion.div>


                </div>}


                {/*Submit area*/}

                {step !== 7 && < div className="w-full">
                    <CustomButton onClick={controller.onContinue_} variant="primary"
                                  disabled={controller.continueButtonDisabled()}
                                  className="text-lg px-12 py-7 w-full leading-none mt-4 lg:mt-6"
                    ><span>{
                        Texts.CONTINUE
                    }</span>
                        <div className="inline-block h-[1em] w-[1em] leading-none text-xl ml-2">
                            <p className="inline-block h-[1em] w-[1em] leading-none [&amp;_svg]:h-[1em] [&amp;_svg]:w-[1em]">
                                <ArrowRight/>
                            </p>
                        </div>
                    </CustomButton>
                </div>}


                {step === 7 && <div>
                    <CustomButton disabled={loading} onClick={controller.onContinue_} variant="primary"
                                  className="text-4xl px-12 py-9  w-full leading-none mt-4 lg:mt-6 items-center"
                    ><span>{
                        Texts.CREATE_TEMPLATE
                    }</span>
                        <BadgePlus className="ml-5 h-8 w-8"/>
                    </CustomButton>
                </div>}

            </div>
            <div className="h-0 md:h-6"></div>
        </motion.main>

    </motion.div>

}