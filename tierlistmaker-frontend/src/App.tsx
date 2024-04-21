import {Helmet} from "react-helmet";
import {Box} from "@/components/ui/box";
import Navigation from "@/layout/Navigation";
import Texts from "@/text/Texts";

import {Route, Routes} from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import CreateTemplatePage from "@/pages/create-template/CreateTemplatePage";
import Paths from "@/Paths";
import {Toaster} from "@/components/ui/sonner";
import CreateTierlistPage from "@/pages/create-tierlist/CreateTierlistPage";
import React, {useContext, useEffect, useState} from "react";
import AppController from "@/controller/AppController";
import AuthPage from "@/pages/auth/AuthPage";
import EditTemplatePage from "@/pages/edit-template/EditTemplatePage";
import NotFoundPage from "@/pages/404/NotFoundPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import PrivacyPolicyPage from "@/pages/privacy-policy/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/terms-of-service/TermsOfServicePage";
import Footer from "@/layout/Footer";

const AuthDoneContext = React.createContext<boolean>(false)


export const useAuthDone = () => useContext(AuthDoneContext)

function App() {

    const [initDone, setInitDone] = useState<boolean>(false)
    const [searchTierlists, setSearchTierlists] = useState<{ name: string, id: string }[]>([])

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
            <Helmet>
                <title>{Texts.SLOGAN} - {Texts.TIERLISTMAKER}</title>
            </Helmet>

            <Toaster/>

            <Navigation initDone={initDone} searchTierlists={searchTierlists}/>

            <AuthDoneContext.Provider value={initDone}>
                <Routes>

                    <Route path={Paths.HOME} element={<HomePage/>}/>
                    <Route path={Paths.CREATE_TEMPLATE} element={<CreateTemplatePage/>}/>
                    <Route path={Paths.CREATE_TIERLIST} element={<CreateTierlistPage/>}/>
                    <Route path={Paths.SIGN_IN} element={<AuthPage/>}/>
                    <Route path={Paths.EDIT_TEMPLATE} element={<EditTemplatePage/>}/>
                    <Route path={Paths.NOT_FOUND} element={<NotFoundPage/>}/>
                    <Route path={Paths.PROFILE} element={<ProfilePage/>}/>
                    <Route path={Paths.PRIVACY_POLICY} element={<PrivacyPolicyPage/>}/>
                    <Route path={Paths.TERMS_OF_SERVICE} element={<TermsOfServicePage/>}/>

                </Routes>
            </AuthDoneContext.Provider>

            <Footer/>

        </Box>
    )
}

export default App
