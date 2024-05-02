export default class Settings {

    public static PRODUCTION = import.meta.env.MODE == "production"

    public static API_URL = Settings.PRODUCTION ? "https://tierlistmaker.org/api" : "http://127.0.0.1:5001/sandbox-655bf/us-central1/api/api"

    public static ALLOW_COOKIES = Boolean(Number(localStorage.getItem("cookieConsentAccepted")))
    //"http://localhost:4000"


}