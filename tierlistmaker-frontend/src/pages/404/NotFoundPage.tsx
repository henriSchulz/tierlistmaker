import {Box} from "@/components/ui/box";
import NotFound from "@/assets/404.svg";

export default function () {


    return <Box gridCenter className="w-full">

        <img src={NotFound} alt="404" className="lg:w-1/2 w-full"/>

    </Box>

}