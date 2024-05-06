import {Box} from "@/components/ui/box";
import Texts from "@/text/Texts";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator";
import TierListCard, {TierlistCardSkeleton} from "@/pages/home/components/TierListCard";
import HomePageController from "@/pages/home/HomePageController";
import LiteTierlist from "@/types/LiteTierlist";
import {useEffect, useState} from "react";
import Office from "@/assets/office.svg";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import AuthenticationService from "@/services/AuthenticationService";
import Paths from "@/Paths";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";


export default function () {

    const [initDone, setInitDone] = useState<boolean>(false)
    const [mostVotedTierlists, setMostVotedTierlists] = useState<LiteTierlist[]>([])
    const [mostVotedSportsTierlists, setMostVotedSportsTierlists] = useState<LiteTierlist[]>([])
    const [mostVotedVideoGamesTierlists, setMostVotedVideoGamesTierlists] = useState<LiteTierlist[]>([])
    const [recentlyCreatedTierlists, setRecentlyCreatedTierlists] = useState<LiteTierlist[]>([])

    const navigate = useNavigate()

    const controller = new HomePageController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            mostVotedTierlistsState: {val: mostVotedTierlists, set: setMostVotedTierlists},
            mostVotedSportsTierlistsState: {val: mostVotedSportsTierlists, set: setMostVotedSportsTierlists},
            mostVotedVideoGamesTierlistsState: {val: mostVotedVideoGamesTierlists, set: setMostVotedVideoGamesTierlists},
            recentlyCreatedTierlistsState: {val: recentlyCreatedTierlists, set: setRecentlyCreatedTierlists}
        }
    })

    useEffect(() => {
        controller.init()
    }, [])


    return <Box className="overflow-hidden">


        <Helmet>
            <title>
                Create, Share, and Explore Tier Lists - Tierlistmaker
            </title>
        </Helmet>

        <Box className="mt-5 w-11/12 lg:mx-20 mx-5 lg:flex lg:content-center lg:items-center grid">
            <Box>
                <h1 dangerouslySetInnerHTML={{__html: Texts.SLOGAN_HTML}}
                    className="title mt-10 b-4 text-6xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"></h1>


                <p className="text-muted-foreground text-lg leading-7 mt-6">
                    {Texts.TIER_LIST_DEFINITION}
                </p>

                <Box gridCenter>
                    <Button onClick={() => {
                        if (AuthenticationService.current) {
                            navigate(Paths.CREATE_TEMPLATE)
                        } else {
                            navigate(Paths.SIGN_IN)
                        }
                    }} className="mt-4 md:w-70 w-full">
                        {Texts.START_FOR_FREE}
                        <ArrowRight className="ml-2"/>
                    </Button>
                </Box>
            </Box>


            <img draggable="false" className="w-full lg:w-7/12 selector" src={Office}/>

        </Box>


        <Box className="lg:mx-20 mx-5">

            <Box className="mt-16">
                <h2 className="text-4xl font-extrabold dark:text-white">
                    {Texts.TIER_SORT_MOST_VOTED}
                </h2>
                <Separator className="my-2"/>
                <Box>
                    <ScrollArea className="w-full whitespace-nowrap gap-4">
                        <Box className="flex w-max space-x-4 p-4">
                            {initDone && mostVotedTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {!initDone && Array.from({length: 5}).map((_, index) => (
                                <TierlistCardSkeleton key={index}/>))}

                            {initDone && mostVotedTierlists.length === 0 && <h3>
                                {Texts.NO_VOTED_TEMPLATES}
                            </h3>}

                        </Box>
                        <ScrollBar orientation={"horizontal"}/>
                    </ScrollArea>
                </Box>
            </Box>

            <Box className="mt-16">
                <h2 className="text-4xl font-extrabold dark:text-white">
                    {Texts.RECENTLY_CREATED_TEMPLATES}
                </h2>
                <Separator className="my-2"/>
                <Box>
                    <ScrollArea className="w-full whitespace-nowrap gap-4">
                        <Box className="flex w-max space-x-4 p-4">
                            {initDone && recentlyCreatedTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {!initDone && Array.from({length: 5}).map((_, index) => (
                                <TierlistCardSkeleton key={index}/>))}

                        </Box>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </Box>
            </Box>



            <Box className="mt-16">
                <h2 className="text-4xl font-extrabold dark:text-white">
                    {Texts.VIDEOS_GAMES_TEMPLATES}
                </h2>
                <Separator className="my-2"/>
                <Box>
                    <ScrollArea className="w-full whitespace-nowrap gap-4">
                        <Box className="flex w-max space-x-4 p-4">
                            {initDone && mostVotedVideoGamesTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {!initDone && Array.from({length: 5}).map((_, index) => (
                                <TierlistCardSkeleton key={index}/>))}

                            {initDone && mostVotedVideoGamesTierlists.length === 0 && <h3>
                                {Texts.NO_VIDEO_GAMES_TEMPLATES}
                            </h3>}

                        </Box>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </Box>
            </Box>

            <Box className="mt-16">
                <h2 className="text-4xl font-extrabold dark:text-white">
                    {Texts.SPORTS_TEMPLATES}
                </h2>
                <Separator className="my-2"/>
                <Box>
                    <ScrollArea className="w-full whitespace-nowrap gap-4">
                        <Box className="flex w-max space-x-4 p-4">
                            {initDone && mostVotedSportsTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {!initDone && Array.from({length: 5}).map((_, index) => (
                                <TierlistCardSkeleton key={index}/>))}

                            {initDone && mostVotedSportsTierlists.length === 0 && <h3>
                                {Texts.NO_SPORTS_TEMPLATES}
                            </h3>}
                        </Box>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </Box>
            </Box>
        </Box>


    </Box>


}