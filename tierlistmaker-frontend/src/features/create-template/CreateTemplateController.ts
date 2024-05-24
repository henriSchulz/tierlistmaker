import State from "@/types/State";
import {toast} from "sonner"
import Texts from "@/text/Texts";
import {getTextFieldValue} from "@/utils";
import ApiService from "@/services/ApiService";
import {NavigateFunction} from "react-router-dom";
import AuthenticationService from "@/services/AuthenticationService";
import Paths from "@/Paths";
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
        rowNamesState: State<string[]>
    },
    navigate: NavigateFunction
    searchParams: { val: URLSearchParams, set: (val: URLSearchParams) => void }
}


export default class CreateTemplateController {


    public static DEFAULT_NUMBER_OF_ROWS = 5
    public static MAX_NUMBER_OF_ROWS = 8
    public static MIN_NUMBER_OF_ROWS = 3
    public static DEFAULT_ROW_NAMES = [
        "S", "A", "B", "C", "D", "E", "F", "G"
    ]

    private states: CreateTemplatePageControllerOptions["states"]
    private readonly navigate: NavigateFunction


    constructor(options: CreateTemplatePageControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
    }

    init = () => {
        if (!AuthenticationService.current) {
            return this.navigate(Paths.HOME)
        }
    }

    continueButtonDisabled = () => {
        switch (this.states.stepState.val) {
            case 0:
                return this.states.templateNameState.val.trim().length < 3
            case 1:
                return this.states.templateDescriptionState.val.trim().length < 10
            case 2:
                return !this.states.templateCategoryState.val
            case 3:
                return
            case 4:
                return !this.states.templateCoverImageState.val
            case 5:
                return this.states.templateImagesState.val.length < 4
        }
    }

    onContinue_ = () => {

        switch (this.states.stepState.val) {
            case 0: {
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
                return this.states.stepState.set(1)
            }

            case 1: {
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
                return this.states.stepState.set(2)
            }

            case 2: {
                return this.states.stepState.set(3)
            }

            case 3: {
                return this.states.stepState.set(4)
            }

            case 4: {
                const tenMB = 10 * 1024 * 1024
                if (!this.states.templateCoverImageState.val) return;
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

                return this.states.stepState.set(5)
            }

            case 5: {

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

                const thirtyMB = 30 * 1024 * 1024

                if (templateImagesSizeSum > thirtyMB) {
                    return toast.error(Texts.TEMPLATE_IMAGES_TOO_LARGE, {
                        action: {
                            label: Texts.OK,
                            onClick: () => {
                                toast.dismiss()
                            }
                        }
                    })
                }

                return this.states.stepState.set(6)
            }


            case 6: {
                const rowNames = []
                for (const i of Array.from({length: this.states.numberOfRowsState.val}, (_, i) => i)) {
                    const textFieldValue = getTextFieldValue(`row-${i}`)

                    if (!textFieldValue || textFieldValue.trim().length === 0) {
                        rowNames.push(CreateTemplateController.DEFAULT_ROW_NAMES[i])
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

                this.states.rowNamesState.set(rowNames)
                return this.states.stepState.set(7)
            }

            case 7: {
                return this.onSubmit()
            }
        }


    }

    onContinue = () => {
    }

    onContinue2 = () => {
    }


    addRow = () => {
        this.states.numberOfRowsState.set(this.states.numberOfRowsState.val + 1)


    }

    removeRow = (index: number) => {

        const rowNames = Array.from({length: this.states.numberOfRowsState.val}, (_, i) => getTextFieldValue(`row-${i}`)!)

        rowNames.splice(index, 1)

        this.states.numberOfRowsState.set(this.states.numberOfRowsState.val - 1)

        for (const i of Array.from({length: this.states.numberOfRowsState.val}, (_, i) => i)) {
            const textField = document.getElementById(`row-${i}`) as HTMLInputElement
            textField.value = rowNames[i]
        }


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
                rowNames.push(CreateTemplateController.DEFAULT_ROW_NAMES[i])
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

