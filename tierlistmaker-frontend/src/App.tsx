import {Box} from "@/components/ui/box";
import Navigation from "@/layout/Navigation";


import {Route, Routes, useLocation} from "react-router-dom";

import HomePage from "@/pages/home/HomePage";

import Paths from "@/Paths";
import {Toaster} from "@/components/ui/sonner";
import CreateTierlistPage from "@/pages/create-tierlist/CreateTierlistPage";
import {useContext, useEffect, useState, createContext} from "react";
import AppController from "@/controller/AppController";
import NotFoundPage from "@/pages/404/NotFoundPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import PrivacyPolicyPage from "@/pages/privacy-policy/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/terms-of-service/TermsOfServicePage";


import SharedTierlistPage from "@/pages/shared/SharedTierlistPage";
import ImprintPage from "@/pages/imprint/ImprintPage";
import LiteTierlist from "@/types/LiteTierlist";
import {AnimatePresence} from "framer-motion";
import Footer from "@/layout/Footer";


const AuthDoneContext = createContext<boolean>(false)
const TierlistsContext = createContext<LiteTierlist[]>([])


export const useAuthDone = () => useContext(AuthDoneContext)
export const useTierlists = () => useContext(TierlistsContext)

function App() {

    const [initDone, setInitDone] = useState<boolean>(false)
    const [searchTierlists, setSearchTierlists] = useState<LiteTierlist[]>([])

    const controller = new AppController({
        states: {
            initDoneState: {val: initDone, set: setInitDone},
            searchTierlistsState: {val: searchTierlists, set: setSearchTierlists}
        }
    })


    useEffect(() => {
        controller.init()
    }, [])


    return (
        <Box>

            <AnimatePresence mode="wait"
                             initial={false}
            >
                <Toaster/>

                {/*<CookieConsent onAcceptCallback={controller.cookieConsentAccepted}*/}
                {/*               onDeclineCallback={controller.cookieConsentDeclined}/>*/}

                <div className="">
                    <Navigation initDone={initDone} searchTierlists={searchTierlists}/>

                    <div>
                        <AuthDoneContext.Provider value={initDone}>

                            <ScrollToTop/>
                            <TierlistsContext.Provider value={searchTierlists}>
                                <Routes>

                                    <Route path={Paths.HOME} element={<HomePage/>}/>
                                    <Route path={Paths.CREATE_TIERLIST} element={<CreateTierlistPage/>}/>
                                    <Route path={Paths.NOT_FOUND} element={<NotFoundPage/>}/>
                                    <Route path={Paths.PROFILE} element={<ProfilePage/>}/>
                                    <Route path={Paths.PRIVACY_POLICY} element={<PrivacyPolicyPage/>}/>
                                    <Route path={Paths.TERMS_OF_SERVICE} element={<TermsOfServicePage/>}/>
                                    <Route path={Paths.SHARED} element={<SharedTierlistPage/>}/>
                                    <Route path={Paths.IMPRINT} element={<ImprintPage/>}/>

                                    <Route path="*" element={<NotFoundPage/>}/>
                                </Routes>

                            </TierlistsContext.Provider>


                        </AuthDoneContext.Provider>
                    </div>

                    <Footer/>
                </div>
            </AnimatePresence>


        </Box>
    )
}

export default App


function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}