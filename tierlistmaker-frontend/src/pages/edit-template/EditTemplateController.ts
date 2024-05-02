import State from "@/types/State";
import {NavigateFunction} from "react-router-dom";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import Paths from "@/Paths";
import ApiService from "@/services/ApiService";
import Tierlist from "@/types/dbmodel/Tierlist";

import Settings from "@/Settings";
import {toast} from "sonner";
import Texts from "@/text/Texts";

import CreateTemplatePageController from "@/pages/create-template/CreateTemplatePageController";
import {getTextFieldValue} from "@/utils";
import React from "react";


interface EditTemplateControllerOptions {
    states: {
        tierlistState: State<Tierlist | null>
        loadingState: State<boolean>
        tierlistNameState: State<string>
        tierlistDescriptionState: State<string>
        publicTemplateState: State<boolean>
        tierlistItemsState: State<TierlistItem[]>
        tierlistRowsState: State<TierlistRow[]>
        tierlistItemIdsToDeleteState: State<string[]>
        templateCoverImageToUpdateState: State<File | null>
        templateImagesToAddState: State<File[]>
        initDoneState: State<boolean>
        numberOfRowsState: State<number>
    },
    navigate: NavigateFunction
}

export default class EditTemplateController {
    states: EditTemplateControllerOptions["states"]
    navigate: NavigateFunction

    constructor(options: EditTemplateControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
    }

    getTierlistItemImageUrl(tierlistId: string, itemId: string) {
        return `${Settings.API_URL}/template-item-image/${tierlistId}/${itemId}`
    }

    init = async (id?: string) => {


        if (!id) {
            return window.location.href = Paths.NOT_FOUND
        }

        const tierlistId = id.split("-").pop()

        if (!tierlistId) {
            return window.location.href = Paths.NOT_FOUND
        }

        const {success: success_, data} = await ApiService.loadTierlist(tierlistId)

        if (!success_ || !data) {
            return window.location.href = Paths.NOT_FOUND
        }


        const {tierlist, tierlistRows, tierlistItems} = data

        this.states.tierlistState.set(tierlist)
        this.states.tierlistRowsState.set(tierlistRows.sort((a, b) => a.rowNumber - b.rowNumber))
        this.states.tierlistItemsState.set(tierlistItems)

        this.states.tierlistNameState.set(tierlist.name)
        this.states.tierlistDescriptionState.set(tierlist.description)
        this.states.publicTemplateState.set(!!tierlist.public)
        this.states.initDoneState.set(true)
        this.states.numberOfRowsState.set(tierlistRows.length)
    }

    onDeleteItem = async (itemId: string) => {
        this.states.tierlistItemIdsToDeleteState.set([...this.states.tierlistItemIdsToDeleteState.val, itemId])
    }

    onUpdateGeneralInformation = async () => {

        const tierlist = this.states.tierlistState.val
        if (!tierlist) return toast.error(Texts.TIERLIST_NOT_FOUND)
        let name: string | undefined = this.states.tierlistNameState.val
        let description: string | undefined = this.states.tierlistDescriptionState.val
        let publicTemplate: boolean | undefined = this.states.publicTemplateState.val


        if (
            name === tierlist.name &&
            description === tierlist.description &&
            publicTemplate === !!tierlist.public
        ) {

            return toast.success(Texts.TIERLIST_INFORMATION_UPDATED)
        }


        if (name === tierlist.name) {
            name = undefined
        }

        if (description === tierlist.description) {
            description = undefined
        }

        if (publicTemplate === !!tierlist.public) {
            publicTemplate = undefined
        }


        const promise = ApiService.updateTierlistInformation(tierlist.id, name, description, publicTemplate)

        toast.promise(promise, {
            loading: Texts.UPDATING_TIERLIST_INFORMATION + "...",
            error: () => {
                this.states.loadingState.set(false)
                return Texts.FAILED_TO_UPDATE_TIERLIST_INFORMATION
            },
            success: () => {
                this.states.loadingState.set(false)
                return Texts.TIERLIST_INFORMATION_UPDATED

            }
        })
    }

    onUpdateImages = async () => {

        if (!this.states.tierlistState.val) return toast.error(Texts.TIERLIST_NOT_FOUND)

        const tierlist = this.states.tierlistState.val

        const itemsToDelete = this.states.tierlistItemIdsToDeleteState.val

        const imagesToAdd = this.states.templateImagesToAddState.val

        const currentItems = this.states.tierlistItemsState.val

        const coverToUpdate = this.states.templateCoverImageToUpdateState.val

        if (coverToUpdate) {
            const tenMB = 10 * 1024 * 1024
            if (coverToUpdate.size > tenMB) {
                return toast.error(Texts.COVER_IMAGE_TOO_LARGE, {
                    action: {
                        label: Texts.OK,
                        onClick: () => {
                            toast.dismiss()
                        }
                    }
                })
            }
        }

        if (imagesToAdd.length > 50) {
            return toast.error(Texts.TOO_MANY_TEMPLATE_IMAGES, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }

        const newItemCount = currentItems.length + imagesToAdd.length - itemsToDelete.length

        if (newItemCount > 200) {
            return toast.error(Texts.TOO_MANY_IMAGES_IN_TEMPLATE, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }


        if (newItemCount < 4) {
            return toast.error(Texts.NOT_ENOUGH_TEMPLATE_IMAGES, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })
        }


        for (const file of imagesToAdd) {
            if (file.name.length > 34) {
                return toast.error(Texts.TEMPLATE_IMAGE_NAME_TOO_LONG.replace("{name}", file.name), {
                    action: {
                        label: Texts.OK,
                        onClick: () => {
                            toast.dismiss()
                        }
                    }
                })
            }
        }

        const templateImagesSizeSum = imagesToAdd.reduce((acc, file) => acc + file.size, 0)

        const fiftyMB = 50 * 1024 * 1024

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


        if (coverToUpdate) {
            await new Promise<void>(resolve => {
                toast.promise(ApiService.updateCoverImage(tierlist.id, coverToUpdate), {
                    loading: Texts.UPDATING_COVER_IMAGE + "...",
                    error: Texts.UPDATING_COVER_IMAGE_FAILED,
                    success: () => {
                        resolve()
                        return Texts.COVER_IMAGE_UPDATED
                    }
                })
            })
        }

        if (itemsToDelete.length > 0) {
            await new Promise<void>(resolve => {
                toast.promise(ApiService.deleteTemplateImages(tierlist.id, itemsToDelete), {
                    loading: Texts.DELETING_TEMPLATE_IMAGES + "...",
                    error: Texts.DELETING_TEMPLATE_IMAGES_FAILED,
                    success: () => {
                        resolve()
                        return Texts.TEMPLATE_IMAGES_DELETED
                    }
                })
            })
        }

        if (imagesToAdd.length > 0) {
            this.states.loadingState.set(true)
            await new Promise<void>(resolve => {
                toast.promise(ApiService.addTemplateImages(tierlist.id, imagesToAdd), {
                    loading: Texts.ADDING_TEMPLATE_IMAGES + "...",
                    error: Texts.ADDING_TEMPLATE_IMAGES_FAILED,
                    success: () => {
                        resolve()
                        return Texts.TEMPLATE_IMAGES_ADDED
                    }
                })
            })
        }

        window.location.href = Paths.EDIT_TEMPLATE.replace(":id", tierlist.id) + "?tab=2"


    }

    onUpdateRows = async () => {
        if (!this.states.tierlistState.val) return toast.error(Texts.TIERLIST_NOT_FOUND)

        const tierlistRows = this.states.tierlistRowsState.val

        const rowNames = Array.from({length: this.states.numberOfRowsState.val}, (_, i) => {
            return getTextFieldValue(`row-${i}`) ?? CreateTemplatePageController.DEFAULT_ROW_NAMES[i]
        })

        const rowsToUpdate: { id: string, name: string }[] = []
        const rowsToAdd: { name: string }[] = []
        const rowsToRemove: { id: string }[] = []


        // rows names are all name of rows in the template
        //tier list rows is the initial rows of the template
        // rows can be added, updated or removed
        //rowName are not unique, but row id is unique
        for (let i = 0; i < rowNames.length; i++) {
            const rowName = rowNames[i]

            if (rowName.length > 34) return toast.error(Texts.ROW_NAME_TOO_LONG, {
                action: {
                    label: Texts.OK,
                    onClick: () => {
                        toast.dismiss()
                    }
                }
            })


            const row = tierlistRows[i]


            if (row) {
                if (row.name === rowName) continue
                rowsToUpdate.push({id: row.id, name: rowName})
            } else {
                rowsToAdd.push({name: rowName ?? CreateTemplatePageController.DEFAULT_ROW_NAMES[i]})
            }
        }

        const initialRowCount = tierlistRows.length

        const newRowCount = rowNames.length

        if (newRowCount < initialRowCount) {
            for (let i = newRowCount; i < initialRowCount; i++) {
                rowsToRemove.push({id: tierlistRows[i].id})
            }
        }

        if (rowsToUpdate.length === 0 && rowsToAdd.length === 0 && rowsToRemove.length === 0) {
            return toast.success(Texts.TEMPLATE_ROWS_UPDATED)
        }


        this.states.loadingState.set(true)
        const promise = ApiService.updateTemplateRows(this.states.tierlistState.val.id, rowsToAdd, rowsToRemove, rowsToUpdate)

        await new Promise<void>(resolve => {
            toast.promise(promise, {
                loading: Texts.UPDATING_TEMPLATE_ROWS + "...",
                error: Texts.FAILED_TO_UPDATE_TEMPLATE_ROWS,
                success: () => {
                    resolve()
                    return Texts.TEMPLATE_ROWS_UPDATED
                }
            })
        })

        setTimeout(() => {
            window.location.href = Paths.EDIT_TEMPLATE.replace(":id", this.states.tierlistState.val!.id) + "?tab=3"
        }, 500)


    }

    addRow = () => {
        const rowCount = this.states.numberOfRowsState.val

        if (rowCount === CreateTemplatePageController.MAX_NUMBER_OF_ROWS) return toast.error(Texts.MAXIMUM_ROW_AMOUNT_ERROR, {

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
        const rowCount = this.states.numberOfRowsState.val

        if (rowCount === CreateTemplatePageController.MIN_NUMBER_OF_ROWS) return toast.error(Texts.MINIMUM_ROW_AMOUNT_ERROR, {

            action: {
                label: Texts.OK,
                onClick: () => {
                    toast.dismiss()
                }
            }
        })

        this.states.numberOfRowsState.set(this.states.numberOfRowsState.val - 1)
    }

    onFileUploadImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        this.states.templateImagesToAddState.set(prev => [...prev, ...files])

        e.target.type = "text"
        e.target.type = "file"
    }


}
