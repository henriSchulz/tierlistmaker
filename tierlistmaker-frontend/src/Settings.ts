export default class Settings {

    public static PRODUCTION = import.meta.env.MODE == "production"

    public static API_URL = Settings.PRODUCTION ? "https://tierlistmaker.org/api" : "http://127.0.0.1:5001/tierlistmaker-2e01f/us-central1/api/api"
    //"http://localhost:4000"


}