import {Box} from "@/components/ui/box";
import Texts from "@/text/Texts";

import TierListCard, {TierlistCardSkeleton} from "@/pages/home/components/TierListCard";
import HomePageController from "@/pages/home/HomePageController";
import LiteTierlist from "@/types/LiteTierlist";
import {useEffect, useState} from "react";
import Office from "@/assets/office.svg";


import {Helmet} from "react-helmet";
import CustomButton from "@/components/custom/Button"
import {ArrowRight, BadgePlus} from "lucide-react";
import {useSearchParams} from "react-router-dom";
import CategoryCard from "@/pages/home/components/CategoryCard";
import AuthenticationService from "@/services/AuthenticationService";
import CreateTemplateSheet from "@/features/create-template/CreateTemplateSheet";
import {useTierlists} from "@/App";
import {motion} from "framer-motion";
import SignInSheet from "@/features/sign-in/SignInSheet";


export default function () {

    const [initDone, setInitDone] = useState<boolean>(false)
    const [mostVotedTierlists, setMostVotedTierlists] = useState<LiteTierlist[]>([])
    const [mostVotedSportsTierlists, setMostVotedSportsTierlists] = useState<LiteTierlist[]>([])
    const [mostVotedVideoGamesTierlists, setMostVotedVideoGamesTierlists] = useState<LiteTierlist[]>([])
    const [recentlyCreatedTierlists, setRecentlyCreatedTierlists] = useState<LiteTierlist[]>([])
    const [currentTab, setCurrentTab] = useState<"mostVoted" | "recentlyCreated" | "categories" | keyof typeof Texts.SELECTION_CATEGORIES>("mostVoted")

    const [showCreateTemplateSheet, setShowCreateTemplateSheet] = useState<boolean>(false)
    const [showSignInSheet, setShowSignInSheet] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const tierlists = useTierlists()

    const controller = new HomePageController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            mostVotedTierlistsState: {val: mostVotedTierlists, set: setMostVotedTierlists},
            mostVotedSportsTierlistsState: {val: mostVotedSportsTierlists, set: setMostVotedSportsTierlists},
            mostVotedVideoGamesTierlistsState: {
                val: mostVotedVideoGamesTierlists,
                set: setMostVotedVideoGamesTierlists
            },
            recentlyCreatedTierlistsState: {val: recentlyCreatedTierlists, set: setRecentlyCreatedTierlists}
        }
    })

    useEffect(() => {
        controller.init().then(() => {
            if (searchParams.has("p")) {
                setCurrentTab(searchParams.get("p") as any)
            }
        })
    }, [])

    const tabs = ["mostVoted", "recentlyCreated", "categories"]

    useEffect(() => {
        if (!initDone) return

        if (currentTab === "mostVoted") {
            searchParams.set("p", "mostVoted")
            setSearchParams(searchParams)
        } else if (currentTab === "recentlyCreated") {
            searchParams.set("p", "recentlyCreated")
            setSearchParams(searchParams)
        } else if (currentTab === "categories") {
            searchParams.set("p", "categories")
            setSearchParams(searchParams)
        }
    }, [currentTab])


    return <div className="overflow-hidden max-w-screen-lg m-auto px-4">


        {showCreateTemplateSheet &&
            <CreateTemplateSheet showState={{val: showCreateTemplateSheet, set: setShowCreateTemplateSheet}}/>}

        {
            showSignInSheet && <SignInSheet showState={{val: showSignInSheet, set: setShowSignInSheet}}/>
        }


        <Helmet>
            <title>
                Create, Share, and Explore Tier Lists - Tierlistmaker
            </title>
        </Helmet>

        <div className="mt-5 lg:flex lg:content-center lg:items-center grid">
            <div>
                <h1 dangerouslySetInnerHTML={{__html: Texts.SLOGAN_HTML}}
                    className="title mt-10 b-4 text-5xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"></h1>


                <p className="text-muted-foreground text-lg leading-7 mt-6">
                    {Texts.TIER_LIST_DEFINITION}
                </p>

                <Box gridCenter>
                    <CustomButton variant="tertiary" onClick={() => {
                        if (AuthenticationService.current) {
                            setShowCreateTemplateSheet(true)
                        } else {
                            setShowSignInSheet(true)
                        }
                    }} className="mt-4 md:w-70 w-full">
                        {Texts.START_FOR_FREE}
                        <ArrowRight className="ml-2"/>
                    </CustomButton>
                </Box>
            </div>


            <motion.img initial={{scale: 0.9}}
                        animate={{scale: 1}} draggable="false" className="w-full lg:w-7/12 selector" src={Office}/>

        </div>


        <div>
            <div className="mt-16">
                <div className="flex justify-between">
                    <div className="grid place-items-center md:flex gap-3">
                        <CustomButton onClick={() => setCurrentTab("mostVoted")}
                                      variant={currentTab === "mostVoted" ? "tertiary" : "disabled"}>
                            {Texts.MOST_VOTED}
                        </CustomButton>

                        <CustomButton
                            onClick={() => setCurrentTab("recentlyCreated")}
                            variant={currentTab === "recentlyCreated" ? "tertiary" : "disabled"}>
                            {Texts.RECENTLY_CREATED}
                        </CustomButton>

                        <CustomButton
                            onClick={() => setCurrentTab("categories")}
                            variant={currentTab === "categories" ? "tertiary" : "disabled"}>
                            {Texts.CATEGORIES}
                        </CustomButton>

                        {!tabs.includes(currentTab) && <CustomButton
                            onClick={() => setCurrentTab("mostVoted")}
                            variant="tertiary">
                            {Texts.SELECTION_CATEGORIES[currentTab as keyof typeof Texts.SELECTION_CATEGORIES]}
                        </CustomButton>}

                    </div>


                    <CustomButton onClick={() => {
                        if (AuthenticationService.current) {
                            setShowCreateTemplateSheet(true)
                        } else {
                            setShowSignInSheet(true)
                        }
                    }} variant="primary">
                        <BadgePlus className="mr-2"/>
                        {Texts.NEW}
                    </CustomButton>
                </div>


                <Box className="mt-16 mb-56">
                    <div className="space-y-2 sm:space-y-0 sm:flex gap-4 sm:flex-wrap">
                        <>
                            {currentTab === "mostVoted" && initDone && mostVotedTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {currentTab === "recentlyCreated" && initDone && recentlyCreatedTierlists.map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}


                            {currentTab === "categories" &&
                                Object.entries(Texts.SELECTION_CATEGORIES).map(([key, value], index) => {
                                    return <CategoryCard onOpen={() => setCurrentTab(key as any)} key={index}
                                                         categoryId={key}
                                                         categoryName={value}/>
                                })}
                            {!tabs.includes(currentTab) && initDone && tierlists.filter(tierlist => tierlist.categoryId === currentTab).map((data, index) => {
                                return <TierListCard key={index} tierlist={data}/>
                            })}

                            {!tabs.includes(currentTab) && initDone && tierlists.filter(tierlist => tierlist.categoryId === currentTab).length === 0 &&
                                <div className="w-full">
                                    <h3 className="">    {Texts.NO_TEMPLATES.replace("{category}", Texts.SELECTION_CATEGORIES[currentTab as keyof typeof Texts.SELECTION_CATEGORIES])}</h3>

                                    <div className="flex justify-center mt-8">

                                        <CustomButton variant="secondary"
                                                      onClick={() => setShowCreateTemplateSheet(true)}>
                                            <BadgePlus className="mr-2"/>
                                            {Texts.CREATE_CATEGORY_TEMPLATE.replace("{category}", Texts.SELECTION_CATEGORIES[currentTab as keyof typeof Texts.SELECTION_CATEGORIES])}
                                        </CustomButton>

                                    </div>

                                </div>}

                        </>

                        {!initDone && Array.from({length: 9}, (_, index) =>
                            <TierlistCardSkeleton key={index}/>
                        )}
                    </div>


                </Box>

            </div>

        </div>


    </div>


}