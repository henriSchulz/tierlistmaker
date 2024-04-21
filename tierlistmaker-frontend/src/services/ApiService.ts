import axios from "axios";
import Settings from "@/Settings";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import Tierlist from "@/types/dbmodel/Tierlist";
import TierlistRow from "@/types/dbmodel/TierlistRow";
import LiteTierlist from "@/types/LiteTierlist";
import AuthenticationService from "@/services/AuthenticationService";
import RequestBuilder from "@/lib/RequestBuilder";


enum APIPaths {
    CREATE_TEMPLATE = "/create-template",
    TEMPLATE = "/template/:id",
    VOTE = "/vote",
    GET_VOTE = "/vote/:id",
    SEARCH_TIERLISTS = "/tierlists",
    MOST_VOTED_TIERLISTS = "/most-voted-tierlists",
    MOST_VOTED_TIERLISTS_BY_CATEGORY = "/categories/most-voted/:id",
    UPDATE_TEMPLATE_INFORMATION = "/update-template-information",
    ADD_TEMPLATE_IMAGES = "/add-template-images",
    DELETE_TEMPLATE_IMAGES = "/delete-template-images",
    UPDATE_TEMPLATE_COVER = "/update-template-cover",
    UPDATE_TEMPLATE_ROWS = "/update-template-rows",
    CLIENT_TEMPLATES = "/client-templates",
    DELETE_TEMPLATE = "/delete-template/:id"
}


export default class ApiService {


    public static async createTierlistTemplate(name: string, description: string, categoryId: string, coverImg: File, templateImgs: File[], rowNames: string[], publicTemplate: boolean): Promise<string> {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.CREATE_TEMPLATE}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: {
                name,
                description,
                categoryId,
                publicTemplate,
                coverImg,
                templateImgs,
                rowNames: JSON.stringify(rowNames),
            }
        })


        const res = await request.send<{ tierlistId: string }>()

        if (res.error || !res.data || res.status !== 200) {
            throw new Error("Error creating tierlist")
        }

        if (!res.data.tierlistId) {
            throw new Error("Error creating tierlist")
        }

        return res.data.tierlistId

    }

    public static async loadTierlist(tierlistId: string): Promise<{
        data: {
            tierlist: Tierlist,
            tierlistRows: TierlistRow[],
            tierlistItems: TierlistItem[]
            votes: number
        } | null, success: boolean
    }> {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.TEMPLATE.replace(":id", tierlistId)} `,
            method: "GET",
            token: AuthenticationService.current?.token,
        })

        try {
            const res = await request.send<{
                tierlist: Tierlist,
                tierlistRows: TierlistRow[],
                tierlistItems: TierlistItem[],
                votes: number
                error?: string
            }>()

            if (res.status !== 200 || !res.data) {
                return {success: false, data: null}
            }

            return {success: true, data: res.data}
        } catch (e) {
            console.error(e)
            return {success: false, data: null}
        }

    }

    public static async voteTierlist(tierlistId: string): Promise<{ success: boolean }> {
        try {
            const request = RequestBuilder.buildRequest({
                url: `${Settings.API_URL}${APIPaths.VOTE}`,
                method: "POST",
                token: AuthenticationService.current?.token,
                body: {
                    tierlistId
                }
            })

            const res = await request.send()

            if (res.error) {
                return {success: false}
            }

            return {success: res.status === 200}
        } catch (e) {
            console.error(e)
            return {success: false}
        }
    }

    public static async unvoteTierlist(tierlistId: string): Promise<{ success: boolean }> {

        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.GET_VOTE.replace(":id", tierlistId)}`,
            method: "DELETE",
            token: AuthenticationService.current?.token,
        })
        const res = await request.send()
        if (res.error) {
            return {success: false}
        }
        return {success: res.status === 200}

    }

    public static async loadIsTierlistVoted(tierlistId: string): Promise<{ success: boolean, voted: boolean }> {
        const auth = true
        if (auth) {
            try {

                const request = RequestBuilder.buildRequest({
                    url: `${Settings.API_URL}${APIPaths.GET_VOTE.replace(":id", tierlistId)}`,
                    method: "GET",
                    token: AuthenticationService.current?.token,
                })
                const res = await request.send<{ voted: boolean }>()


                if (res.error || !res.data) {
                    console.error(res.error ?? "Error loading voted tierlists")
                    return {success: false, voted: false}
                }


                return {success: res.status === 200, voted: res.data.voted}
            } catch (e) {
                console.error(e)
                return {success: false, voted: false}
            }
        } else {
            return {success: false, voted: false}
        }
    }

    public static async loadSearchTierlists(): Promise<{ success: boolean, tierlists: LiteTierlist[] }> {
        try {

            const request = RequestBuilder.buildRequest({
                url: `${Settings.API_URL}${APIPaths.SEARCH_TIERLISTS}`,
                method: "GET",
                token: AuthenticationService.current?.token,
            })

            const res = await request.send<{ tierlists: LiteTierlist[] }>()

            if (res.error || !res.data) {
                console.error(res.error ?? "Error loading tierlists")
                return {success: false, tierlists: []}
            }


            return {success: true, tierlists: res.data.tierlists}
        } catch (e) {
            console.error(e)
            return {success: false, tierlists: []}
        }
    }

    public static async loadMostVotedTierlists(): Promise<{ success: boolean, tierlists: LiteTierlist[] }> {
        try {
            const request = RequestBuilder.buildRequest({
                url: `${Settings.API_URL}${APIPaths.MOST_VOTED_TIERLISTS}`,
                method: "GET",
                token: AuthenticationService.current?.token,
            })
            const res = await request.send<{ tierlists: LiteTierlist[] }>()

            if (res.error || !res.data) {
                console.error(res.error ?? "Error loading most voted tierlists")
                return {success: false, tierlists: []}
            }

            return {success: true, tierlists: res.data.tierlists}
        } catch (e) {
            console.error(e)
            return {success: false, tierlists: []}
        }
    }

    public static async loadMostVotedTierlistsByCategory(categoryId: string): Promise<{ success: boolean; tierlists: LiteTierlist[] }> {
        try {
            const response = await axios.get(`${Settings.API_URL}${APIPaths.MOST_VOTED_TIERLISTS_BY_CATEGORY.replace(":id", categoryId)}`)
            if (response.data.error) {
                return {success: false, tierlists: []}
            }
            return {success: true, tierlists: response.data.tierlists}
        } catch (e) {
            console.error(e)
            return {success: false, tierlists: []}
        }
    }

    public static async updateTierlistInformation(tierlistId: string, name?: string, description?: string, publicTemplate?: boolean): Promise<void> {

        if (!name && !description && publicTemplate === undefined) return

        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.UPDATE_TEMPLATE_INFORMATION}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            body: {
                name,
                description,
                tierlistId,
                publicTemplate
            }
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error updating tierlist")
        }


    }

    public static async addTemplateImages(tierlistId: string, images: File[]): Promise<void> {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.ADD_TEMPLATE_IMAGES}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            headers: {
                "Content-Type": "multipart/form-data",

            },
            body: {
                tierlistId,
                templateImgs: images
            }
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error adding images")
        }

    }

    public static async deleteTemplateImages(tierlistId: string, itemIds: string[]): Promise<void> {

        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.DELETE_TEMPLATE_IMAGES}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            body: {
                tierlistId,
                templateItemIds: itemIds
            }
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error deleting images")
        }
    }

    public static async updateCoverImage(tierlistId: string, coverImg: File): Promise<void> {

        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.UPDATE_TEMPLATE_COVER}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            headers: {
                "Content-Type": "multipart/form-data",

            },
            body: {
                tierlistId,
                coverImg
            }
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error updating cover image")
        }
    }

    public static async updateTemplateRows(tierlistId: string, addRows: { name: string }[], deleteRows: { id: string }[], updateRows: { id: string, name: string }[]): Promise<void> {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.UPDATE_TEMPLATE_ROWS}`,
            method: "POST",
            token: AuthenticationService.current?.token,
            body: {
                tierlistId,
                addRows: JSON.stringify(addRows),
                deleteRows: JSON.stringify(deleteRows),
                updateRows: JSON.stringify(updateRows)
            }
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error updating rows")
        }
    }

    public static async loadClientTemplates(): Promise<{ success: boolean, templates: LiteTierlist[] }> {
        try {
            const request = RequestBuilder.buildRequest({
                url: `${Settings.API_URL}${APIPaths.CLIENT_TEMPLATES}`,
                method: "GET",
                token: AuthenticationService.current?.token,
            })

            const res = await request.send<{ tierlists: LiteTierlist[] }>()

            if (res.error || !res.data) {
                console.error(res.error ?? "Error loading client templates")
                return {success: false, templates: []}
            }

            return {success: true, templates: res.data.tierlists}
        } catch (e) {
            console.error(e)
            return {success: false, templates: []}
        }
    }

    public static async deleteTemplate(tierlistId: string): Promise<void> {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}${APIPaths.DELETE_TEMPLATE.replace(":id", tierlistId)}`,
            method: "DELETE",
            token: AuthenticationService.current?.token,
        })

        const res = await request.send<{ message: string }>()

        if (res.error || res.status !== 200) {
            throw new Error("Error deleting tierlist")
        }
    }


}