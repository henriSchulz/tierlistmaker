import {Box} from "@/components/ui/box";
import AuthenticationService from "@/services/AuthenticationService";
import {useNavigate} from "react-router-dom";
import Texts from "@/text/Texts";

import {LogOut} from "lucide-react";
import {useEffect, useState} from "react";
import ProfilePageController from "@/pages/profile/ProfilePageController";
import LiteTierlist from "@/types/LiteTierlist";
import TierListCard, {TierlistCardSkeleton} from "@/pages/home/components/TierListCard";
import {Skeleton} from "@/components/ui/skeleton";
import {useAuthDone} from "@/App";
import {Helmet} from "react-helmet";

import CustomButtom from "@/components/custom/Button";
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
        <div className="w-full grid place-items-center">

            <Helmet>
                <title>
                    {Texts.PROFILE} - Tierlistmaker
                </title>
            </Helmet>

            <div className="mt-10 max-w-screen-lg mb-8 overflow-hidden">

                <h1 className="text-4xl font-bold leading-none text-gray-700 ">{Texts.PROFILE}</h1>
                <p className="text-lg text-base font-medium text-gray-500">
                    {Texts.PROFILE_DESCRIPTION}
                </p>


                <div className="mt-6">
                    <div className="flex place-items-center">
                        {initDone && <img referrerPolicy="no-referrer" src={AuthenticationService.current?.imgUrl}
                                          className="rounded-full w-24 h-24"/>}

                        {!initDone && <Skeleton className="w-24 h-24 rounded-full"/>}

                        <div className="ml-4 w-72">

                            {initDone &&
                                <h3 className="text-3xl lg:text-4xl font-bold">{AuthenticationService.current?.userName}</h3>}
                            {!initDone && <Skeleton className="w-[200px] h-[40px]"/>}

                            {initDone &&
                                <p className="text-md lg:text-lg mt-1">{AuthenticationService.current?.email}</p>}
                            {!initDone && <Skeleton className="w-[200px] h-[28px] mt-1"/>}

                            <CustomButtom disabled={!initDone} className="mt-2" variant="tertiary">
                                <LogOut size={24} className="mr-2"/>
                                {Texts.LOGOUT}
                            </CustomButtom>
                        </div>
                    </div>

                    <Box>
                        <h3 className="text-3xl font-bold leading-none text-gray-700 mt-10">{Texts.MY_TIER_LIST_TEMPLATES}</h3>

                        <div className="space-y-2 sm:space-y-0 sm:flex gap-4 sm:flex-wrap mt-4">
                            <>
                                {initDone && clientTemplates.map((template, index) => (
                                    <TierListCard key={index} tierlist={template}/>
                                ))}
                            </>

                            {!initDone && Array.from({length: 9}, (_, index) =>
                                <TierlistCardSkeleton key={index}/>
                            )}
                        </div>


                    </Box>

                </div>
            </div>

        </div>
    )
}