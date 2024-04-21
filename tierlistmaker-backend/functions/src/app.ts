import Application from "./Application";
// import * as path from "path";

export const app = new Application(
    process.env.NODE_ENV === "production",
    require("./keys/sandbox-655bf-firebase-adminsdk-8ijzk-d11014687d.json")
)


