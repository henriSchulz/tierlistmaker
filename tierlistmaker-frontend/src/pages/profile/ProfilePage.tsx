import {Box} from "@/components/ui/box";
import AuthenticationService from "@/services/AuthenticationService";
import {useNavigate} from "react-router-dom";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Texts from "@/text/Texts";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {useEffect, useState} from "react";
import ProfilePageController from "@/pages/profile/ProfilePageController";
import LiteTierlist from "@/types/LiteTierlist";
import TierListCard, {TierlistCardSkeleton} from "@/pages/home/components/TierListCard";
import {Skeleton} from "@/components/ui/skeleton";
import {useAuthDone} from "@/App";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Helmet} from "react-helmet";


export default function () {
    const navigate = useNavigate()


    const [initDone, setInitDone] = useState(false)
    const [clientTemplates, setClientTemplates] = useState<LiteTierlist[]>([])

    const authDone = useAuthDone()

    const controller = new ProfilePageController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            clientTemplatesState: {val: clientTemplates, set: setClientTemplates}
        },
        navigate
    })


    useEffect(() => {
        if (!authDone) return
        controller.init()
    }, [authDone])

    return (
        <Box gridCenter className="w-full">

            <Helmet>
                <title>
                    {Texts.PROFILE} - Tierlistmaker
                </title>
            </Helmet>

            <Card className="mt-10 w-11/12 lg:w-2/3 mb-8 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-4xl">{Texts.PROFILE}</CardTitle>
                    <CardDescription className="text-lg">
                        {Texts.PROFILE_DESCRIPTION}
                    </CardDescription>
                </CardHeader>

                <CardContent className="mt-6">
                    <Box className="flex place-items-center">
                        {initDone && <img referrerPolicy="no-referrer" src={AuthenticationService.current?.imgUrl}
                                          className="rounded-full w-24 h-24"/>}

                        {!initDone && <Skeleton className="w-24 h-24 rounded-full"/>}

                        <Box className="ml-4 w-72">

                            {initDone &&
                                <h3 className="text-3xl lg:text-4xl font-bold">{AuthenticationService.current?.userName}</h3>}
                            {!initDone && <Skeleton className="w-[200px] h-[40px]"/>}

                            {initDone &&
                                <p className="text-md lg:text-lg mt-1">{AuthenticationService.current?.email}</p>}
                            {!initDone && <Skeleton className="w-[200px] h-[28px] mt-1"/>}

                            <Button disabled={!initDone} className="mt-2" variant="secondary">
                                <LogOut size={24} className="mr-2"/>
                                {Texts.LOGOUT}
                            </Button>
                        </Box>
                    </Box>

                    <Box>
                        <h3 className="text-3xl mt-10 font-bold">{Texts.MY_TIER_LIST_TEMPLATES}</h3>
                        <ScrollArea className="w-full whitespace-nowrap gap-4">
                            <Box className="flex w-max space-x-4 p-4">
                                {initDone && clientTemplates.map((template, index) => (
                                    <TierListCard key={index} tierlist={template}/>
                                ))}

                                {!initDone && Array.from({length: 3}).map((_, index) => (
                                    <TierlistCardSkeleton key={index}/>
                                ))}

                                {initDone && clientTemplates.length === 0 && (
                                    <Box className="w-full mt-4 text-center">
                                        <p>{Texts.NO_TEMPLATES_CREATED_YET}</p>
                                    </Box>
                                )}
                            </Box>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                    </Box>

                </CardContent>
            </Card>

        </Box>
    )
}