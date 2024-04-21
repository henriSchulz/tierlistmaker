import en from "@/text/languages/en";

const LANGUAGES = {
    en
}

const LANGUAGE = "en";

const Texts = LANGUAGE in LANGUAGES ? LANGUAGES[LANGUAGE] : LANGUAGES["en"];


export default Texts;
