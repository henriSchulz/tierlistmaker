import State from "@/types/State";
import {useEffect, useState} from "react";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import {useNavigate} from "react-router-dom";
import {useAuthDone} from "@/App";
import EditTemplateController from "@/features/edit-template/EditTemplateController";
import CustomButton from "@/components/custom/Button";
import {motion} from "framer-motion";
import Texts from "@/text/Texts";

import {Image, Plus, Save, Trash, X} from "lucide-react";

import UploadImageItem from "@/features/create-template/components/UploadImageItem";

import {Skeleton} from "@/components/ui/skeleton";
import EditTierlistItem from "@/features/edit-template/components/EditTierlistItem";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import CreateTemplateController from "@/features/create-template/CreateTemplateController";


interface EditTemplateSheetProps {
    showState: State<boolean>
    id: string
}

export default function ({showState, id}: EditTemplateSheetProps) {

    const [tierlist, setTierlist] = useState<Tierlist | null>(null)
    const [loading, setLoading] = useState(false)
    const [tierlistName, setTierlistName] = useState("")
    const [tierlistDescription, setTierlistDescription] = useState("")
    const [isPublicTierlist, setIsPublicTierlist] = useState(true)
    const [tierlistItems, setTierlistItems] = useState<TierlistItem[]>([])
    const [tierlistRows, setTierlistRows] = useState<TierlistRow[]>([])
    const [tierlistItemIdsToDelete, setTierlistItemIdsToDelete] = useState<string[]>([])
    const [templateCoverImageToUpdate, setTemplateCoverImageToUpdate] = useState<File | null>(null)
    const [templateImagesToAdd, setTemplateImagesToAdd] = useState<File[]>([])
    const [numberOfRows, setNumberOfRows] = useState(0)
    const [initDone, setInitDone] = useState(false)
    const [step, setStep] = useState(0)
    const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<string>("")

    const [imageSettingsToggle, setImageSettingsToggle] = useState(true) //toggle if user is deleting or adding images


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
            numberOfRowsState: {val: numberOfRows, set: setNumberOfRows},
            currentTapState: {val: step, set: setStep},
        },
        navigate
    })

    useEffect(() => {
        if (!authDone) return
        controller.init(id).then(() => {
            getDownloadURL(ref(storage, `${id}/cover.png`)).then(url => {
                setCurrentCoverImageUrl(url)
            })
        })
    }, [authDone, id])


    const steps = [
        {
            name: Texts.GENERAL,
            subtitle: Texts.EDIT_GENERAL_INFORMATION_SUBTITLE
        }, {
            name: Texts.COVER,
            subtitle: Texts.EDIT_TEMPLATE_COVER_SUBTITLE
        }, {
            name: Texts.IMAGES,
            subtitle: Texts.EDIT_TEMPLATE_IMAGES_SUBTITLE
        }, {
            name: Texts.TIERS,
            subtitle: Texts.EDIT_TEMPLATE_ROWS_SUBTITLE
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
        <CustomButton variant="tertiary" onClick={() => showState?.set(false)}
                      className="absolute right-4 top-4 lg:right-10 lg:top-10">
            <X/>
        </CustomButton>

        <motion.main layout
                     className="mt-10 flex flex-col items-center justify-center">

            <div id="tabs" className="gap-2 flex mb-6 md:mb-12">

                {steps.map((s, index) => <CustomButton disabled={loading || !initDone} className="py-3 md:px-16 md:py-6"
                                                       variant={index === step ? "tertiary" : "text"} key={index}
                                                       onClick={() => setStep(index)}>
                    {s.name}
                </CustomButton>)}

            </div>

            <div className="mb-12 text-center">
                <h1 className="text-2xl font-bold md:text-3xl">
                    {Texts.EDIT_TEMPLATE}
                </h1>
                <p className="mt-1 text-base font-medium text-gray-500 lg:text-xl">
                    {steps[step].subtitle}
                </p>
            </div>
            <div className="w-full max-w-xl">

                {step === 0 && <div>
                    {initDone && <div
                        className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                        {tierlistName.trim().length === 0 && <div
                            className="absolute select-none px-2 text-xl font-bold text-gray-800/20 md:px-4 md:text-3xl"
                        >{Texts.TEMPLATE_NAME_EXAMPLE}
                        </div>}
                        <input type="text" value={tierlistName} onChange={e => setTierlistName(e.target.value)}
                               className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-2 md:px-4 md:text-3xl"
                        />
                    </div>}

                    {!initDone && <Skeleton className="h-[69px] rounded-2xl"/>}

                    {initDone && <div
                        className="mt-4 relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                        {tierlistDescription.trim().length === 0 && <div
                            className="absolute select-none px-2 text-xl font-bold text-gray-800/20 md:px-4 md:text-3xl"
                        >{Texts.TEMPLATE_DESCRIPTION_EXAMPLE}
                        </div>}
                        <textarea rows={3} value={tierlistDescription}
                                  onChange={e => setTierlistDescription(e.target.value)}
                                  className="resize-none z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-2 md:px-4 md:text-3xl"
                        />
                    </div>}

                    {!initDone && <Skeleton className="mt-4 h-[140px] rounded-2xl"/>}

                    <div className="mt-4 flex space-x-2 items-center justify-center">

                        <CustomButton disabled={loading || !initDone} className="w-full py-6"
                                      onClick={() => setIsPublicTierlist(true)}
                                      variant={isPublicTierlist && (!loading && initDone) ? "secondary" : "tertiary"}>
                            {Texts.PUBLIC}
                        </CustomButton>

                        <CustomButton disabled={loading || !initDone} className="w-full py-6"
                                      onClick={() => setIsPublicTierlist(false)}
                                      variant={!isPublicTierlist && (!loading && initDone) ? "secondary" : "tertiary"}>
                            {Texts.PRIVATE}

                        </CustomButton>

                    </div>


                </div>}


                {step === 1 && <div>


                    <img height={250} src={currentCoverImageUrl}
                         className="mb-6 w-full justify-center tier-list-card aspect-video object-fill object-center selector"/>


                    <div
                        className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
                        <CustomButton onClick={() => document.getElementById("cover-image")?.click()}
                                      variant="tertiary"
                                      className="z-10 w-full bg-transparent py-1 px-2 text-xl font-bold focus:outline-none md:py-5 md:px-4 md:text-3xl"
                        >

                            <Image className="w-8 h-8 mr-4"/>
                            {!templateCoverImageToUpdate && Texts.UPDATE_COVER_IMAGE}
                            {templateCoverImageToUpdate &&
                                <span className="overflow-hidden whitespace-nowrap w-[80%] text-lg md:text-2xl"

                                >{templateCoverImageToUpdate.name}</span>}
                        </CustomButton>

                        <input type="file" id="cover-image" accept="image/*" onChange={e => {
                            if (e.target.files) {
                                setTemplateCoverImageToUpdate(e.target.files[0])
                                setCurrentCoverImageUrl(URL.createObjectURL(e.target.files[0]))
                            }
                        }} className="hidden"/>
                    </div>

                </div>}


                {step === 2 && <div>


                    <div className="flex items-center justify-center space-x-2">
                        <CustomButton className="w-full" onClick={() => setImageSettingsToggle(true)}
                                      variant={imageSettingsToggle ? "secondary" : "tertiary"}>
                            {Texts.DELETE}
                        </CustomButton>
                        <CustomButton className="w-full" onClick={() => setImageSettingsToggle(false)}
                                      variant={!imageSettingsToggle ? "secondary" : "tertiary"}>
                            {Texts.ADD}
                        </CustomButton>

                    </div>


                    {imageSettingsToggle && <div><h1 className="text-xl font-bold md:text-2xl">
                        {Texts.CURRENT_TEMPLATE_IMAGES}
                    </h1>
                        <div className="flex flex-wrap">
                            {initDone && tierlistItems.filter(item => !tierlistItemIdsToDelete.includes(item.id)).map((item, index) => (
                                <EditTierlistItem key={index} item={item} controller={controller}/>
                            ))}

                            {!initDone && Array.from({length: 5}, (_, index) => (
                                <Skeleton key={index}
                                          className={`h-[40px] w-[40px]`}/>
                            ))}
                        </div>
                    </div>}


                    {!imageSettingsToggle && <div className="mt-4">

                        <ul className="list-disc text-gray-500 text-base">
                            <li className="ml-8">{Texts.CHOOSE_ALL_IMAGES_AT_ONCE}</li>
                            <li className="ml-8">{Texts.USE_CONSISTENT_IMAGES}</li>
                            <li className="ml-8">{Texts.MINIMUM_IMAGE_AMOUNT}</li>
                            <li className="ml-8">
                                {Texts.IMAGE_NAME_INFO}
                            </li>
                        </ul>

                        <div
                            className="mt-4 relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">
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
                            {templateImagesToAdd.map((image, index) => (
                                <UploadImageItem key={index} image={image}
                                                 deleteItem={() => {
                                                     setTemplateImagesToAdd(prev => prev.filter((_, i) => i !== index))
                                                 }
                                                 }/>
                            ))}
                        </div>
                    </div>}


                </div>}


                {step === 3 && <div>

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
                                       defaultValue={tierlistRows[i]?.name ??
                                           CreateTemplateController.DEFAULT_ROW_NAMES[i]
                                       }
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

                {/*/!*Submit area*!/*/}

                < div className="w-full">
                    <CustomButton onClick={controller.saveChanges} variant="primary"
                                  disabled={controller.saveChangesButtonDisabled()}
                                  className="text-lg px-12 py-7 w-full leading-none mt-4 lg:mt-6"
                    ><span>{
                        Texts.SAVE_CHANGES
                    }</span>
                        <div className="inline-block h-[1em] w-[1em] leading-none text-xl ml-2">
                            <p className="inline-block h-[1em] w-[1em] leading-none [&amp;_svg]:h-[1em] [&amp;_svg]:w-[1em]">
                                <Save/>
                            </p>
                        </div>
                    </CustomButton>
                </div>

            </div>
            <div className="h-0 md:h-6"></div>
        </motion.main>

    </motion.div>

}