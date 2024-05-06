import {Box} from "@/components/ui/box";
import NotFound from "@/assets/404.svg";
import {Helmet} from "react-helmet";

export default function () {


    return <Box gridCenter className="w-full">

        <Helmet>
            <title>
                404 - Tierlistmaker
            </title>
        </Helmet>

        <img src={NotFound} alt="404" className="lg:w-1/2 w-full"/>

    </Box>

}