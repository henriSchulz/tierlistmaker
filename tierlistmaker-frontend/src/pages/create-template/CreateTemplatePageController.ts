import State from "@/types/State";
import {toast} from "sonner"
import Texts from "@/text/Texts";
import {getTextFieldValue} from "@/utils";
import ApiService from "@/services/ApiService";
import {NavigateFunction} from "react-router-dom";
import AuthenticationService from "@/services/AuthenticationService";
import Paths from "@/Paths";
import AppController from "@/controller/AppController";
import React from "react";

interface CreateTemplatePageControllerOptions {
    states: {
        stepState: State<number>
        numberOfRowsState: State<number>
        templateNameState: State<string>
        templateDescriptionState: State<string>
        templateCategoryState: State<string | undefined>
        templateCoverImageState: State<File | null>
        templateImagesState: State<File[]>
        isPublicTierlistState: State<boolean>
        dragTemplateImageActiveState: State<boolean>
        dragCoverImageActiveState: State<boolean>
        loadingState: State<boolean>
        showImageNamesState: State<boolean>
    },
    navigate: NavigateFunction
    searchParams: { val: URLSearchParams, set: (val: URLSearchParams) => void }
}


export default class CreateTemplatePageController {


    public static DEFAULT_NUMBER_OF_ROWS = 5
    public static MAX_NUMBER_OF_ROWS = 8
    public static MIN_NUMBER_OF_ROWS = 3
    public static DEFAULT_ROW_NAMES = [
        "S", "A", "B", "C", "D", "E", "F", "G"
    ]

    private states: CreateTemplatePageControllerOptions["states"]
    private navigate: NavigateFunction


    constructor(options: CreateTemplatePageControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
    }

    init = () => {

        if (!AppController.INITIAL_INIT_DONE) return

        if (!AuthenticationService.current) {
            this.navigate(Paths.SIGN_IN + "?redirect=" + Paths.CREATE_TEMPLATE)
        }
    }

    onContinue = () => {
        if (this.states.templateNameState.val.trim().length === 0) {
            return toast.error(Texts.ENTER_A_TEMPLATE_NAME, {

                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateNameState.val.trim().length < 3) {
            return toast.error(Texts.TEMPLATE_NAME_TOO_SHORT, {

                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateNameState.val.trim().length > 200) {
            return toast.error(Texts.TEMPLATE_NAME_TOO_LONG, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (!this.states.templateCategoryState.val) {
            return toast.error(Texts.SELECT_A_CATEGORY, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateDescriptionState.val.trim().length === 0) {
            return toast.error(Texts.ENTER_A_TEMPLATE_DESCRIPTION, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateDescriptionState.val.trim().length < 10) {
            return toast.error(Texts.TEMPLATE_DESCRIPTION_TOO_SHORT, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateDescriptionState.val.trim().length > 500) {
            return toast.error(Texts.TEMPLATE_DESCRIPTION_TOO_LONG, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }


        this.states.stepState.set(1)
    }

    onContinue2 = () => {
        if (!this.states.templateCoverImageState.val) {
            return toast.error(Texts.SELECT_A_COVER_IMAGE, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        const tenMB = 10 * 1024 * 1024

        if (this.states.templateCoverImageState.val.size > tenMB) {
            return toast.error(Texts.COVER_IMAGE_TOO_LARGE, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateImagesState.val.length === 0) {
            return toast.error(Texts.PLEASE_SELECT_TEMPLATE_IMAGES, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateImagesState.val.length < 4) {
            return toast.error(Texts.NOT_ENOUGH_TEMPLATE_IMAGES, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        if (this.states.templateImagesState.val.length > 50) {
            return toast.error(Texts.TOO_MANY_TEMPLATE_IMAGES, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        const templateImagesSizeSum = this.states.templateImagesState.val.reduce((acc, file) => acc + file.size, 0)

        const fiftyMB = 50 * 1024 * 1024

        // for (const file of this.states.templateImagesState.val) {
        //     if (file.name.length > 34) {
        //         return toast.error(Texts.TEMPLATE_IMAGE_NAME_TOO_LONG.replace("{name}", file.name), {
        //             action: {
        //                 label: Texts.OK,
        //                 onClick: () => {
        //                     toast.dismiss()
        //                 }
        //             }
        //         })
        //     }
        // }

        if (templateImagesSizeSum > fiftyMB) {
            return toast.error(Texts.TEMPLATE_IMAGES_TOO_LARGE, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        this.states.stepState.set(2)
    }


    addRow = () => {
        if (this.states.numberOfRowsState.val === CreateTemplatePageController.MAX_NUMBER_OF_ROWS)
            return toast.error(Texts.MAXIMUM_ROW_AMOUNT_ERROR, {

                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })


        this.states.numberOfRowsState.set(this.states.numberOfRowsState.val + 1)


    }

    removeRow = () => {
        if (this.states.numberOfRowsState.val === CreateTemplatePageController.MIN_NUMBER_OF_ROWS)
            return toast.error(Texts.MINIMUM_ROW_AMOUNT_ERROR, {

                action: {
                    label: Texts.OK,
                    onClick: () => {

                    }
                }
            })

        this.states.numberOfRowsState.set(this.states.numberOfRowsState.val - 1)
    }

    onFileUploadImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        this.states.templateImagesState.set(prev => [...prev, ...files])

        e.target.type = "text"
        e.target.type = "file"
    }

    onSubmit = () => {
        const rowNames = []
        for (const i of Array.from({length: this.states.numberOfRowsState.val}, (_, i) => i)) {
            const textFieldValue = getTextFieldValue(`row-${i}`)

            if (!textFieldValue) {
                rowNames.push(CreateTemplatePageController.DEFAULT_ROW_NAMES[i])
                continue
            }


            if (textFieldValue.trim().length > 34) {
                return toast.error(Texts.ROW_NAME_TOO_LONG, {
                    action: {
                        label: Texts.OK,
                        onClick: () => {
                            toast.dismiss()
                        }
                    }
                })
            }
            rowNames.push(textFieldValue)
        }


        console.log(rowNames)
        this.states.loadingState.set(true)
        const promise = ApiService.createTierlistTemplate(
            this.states.templateNameState.val,
            this.states.templateDescriptionState.val,
            this.states.templateCategoryState.val!,
            this.states.templateCoverImageState.val!,
            this.states.templateImagesState.val,
            rowNames,
            this.states.isPublicTierlistState.val,
            this.states.showImageNamesState.val
        )

        toast.promise(promise, {
            loading: Texts.CREATING_TEMPLATE,
            success: id => {
                setTimeout(() => {
                    localStorage.removeItem("templateName")
                    localStorage.removeItem("templateDescription")
                    localStorage.removeItem("templateCategory")
                    const templateName = this.states.templateNameState.val.split(" ").join("-").toLowerCase()


                    window.location.href = `/create/${templateName}-${id}`
                }, 500)


                return Texts.TEMPLATE_CREATED
            },
            error: () => {
                this.states.loadingState.set(false)
                return Texts.FAILED_TO_CREATE_TEMPLATE
            }
        })


    }

}

