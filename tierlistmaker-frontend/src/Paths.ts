import LiteTierlist from "@/types/LiteTierlist";

enum Paths {
    HOME = "/",
    CREATE_TEMPLATE = "/create-template",
    CREATE_TIERLIST = "/create/:id", // id consists of the template name and the template id
    NOT_FOUND = "/404",
    CATEGORIES = "/?p=categories",
    SIGN_IN = "/sign-in",
    EDIT_TEMPLATE = "/edit/:id",
    PROFILE = "/profile",
    PRIVACY_POLICY = "/privacy-policy",
    TERMS_OF_SERVICE = "/terms-of-service",
    SHARED = "/shared/:id",
    IMPRINT = "/imprint",
    CATEGORY = "/?p=:id",
}


export class PathUtils {
    public static getCreateTierlistPath(tierlist: LiteTierlist): string {
        return Paths.CREATE_TIERLIST.replace(":id", `${tierlist.name.split(" ").join("-")}-${tierlist.id}`)
    }
}


export default Paths