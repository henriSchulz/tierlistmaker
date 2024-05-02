import {Card, CardDescription, CardTitle} from "@/components/ui/card";
import Texts from "@/text/Texts";
import {Box} from "@/components/ui/box";
import {Button} from "@/components/ui/button";
import Google from "@/assets/google.svg";
import AuthenticationService from "@/services/AuthenticationService";
import {useSearchParams} from "react-router-dom";

export default function () {

    const [searchParams] = useSearchParams();

    return <Box className="grid place-items-center mt-14">
        <Card className="p-4 w-11/12 lg:w-2/5">

            <CardTitle>{Texts.LINK_GOOGLE_ACCOUNT}</CardTitle>

            <CardDescription>{Texts.LINK_GOOGLE_ACCOUNT_DESCRIPTION}</CardDescription>

            <Button onClick={() => AuthenticationService.signInWithGoogle(searchParams.get("redirect"))}
                    className="mt-4 w-full p-3">
                <img className="mr-3" height={35} width={35} src={Google}/>

                {Texts.CONTINUE_WITH_GOOGLE}</Button>

            <p
                className="mt-2">{Texts.BY_CONTINUING_YOU_AGREE_TO_OUR_TERMS}</p>


        </Card>
    </Box>
}