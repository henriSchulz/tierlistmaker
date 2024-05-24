import State from "@/types/State";
import CustomButton from "@/components/custom/Button";
import {motion} from "framer-motion";
import Texts from "@/text/Texts";
import Google from "@/assets/google.svg"
import AuthenticationService from "@/services/AuthenticationService";


interface SignInSheetProps {
    showState: State<boolean>
}


export default function ({showState}: SignInSheetProps) {
    return <motion.div
        initial={{
            opacity: 0,
            scale: 0.9
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}
        exit={{opacity: 0, scale: 0.9}}
        className="create-template-sheet">
        <CustomButton onClick={() => showState?.set(false)} className="absolute right-4 top-4 lg:right-10 lg:top-10">
            Close
        </CustomButton>

        <motion.main layout layoutId="create-template-main"
                     className="mt-40 flex flex-col items-center justify-center">
            <div className="mb-6 text-center w-1/2">
                <h1 className="text-2xl font-bold md:text-3xl">
                    {Texts.LINK_GOOGLE_ACCOUNT}
                </h1>
                <p className="mt-1 text-base font-medium text-gray-500 lg:text-xl ">
                    {Texts.LINK_GOOGLE_ACCOUNT_DESCRIPTION}
                </p>
            </div>
            <div className="grid items-center place-items-center w-1/2">


                <motion.button
                    whileHover={{scale: 0.97}}
                    whileTap={{scale: 0.93}}
                    onClick={() => AuthenticationService.signInWithGoogle()}
                    className="mt-5 flex rounded-xl border border-gray-200 py-4 px-6 font-medium text-gray-600 shadow-sm"
                >
                    <div className="mr-4 h-6 w-6"><img src={Google} className="h-full w-full"
                                                       alt="logo of ColorMagic"/></div>
                    Log in with Google
                </motion.button>

                <p className="mt-6 font-bold text-gray-500">{Texts.BY_CONTINUING_YOU_AGREE_TO_OUR_TERMS}</p>


            </div>
            <div className="h-0 md:h-6"></div>
        </motion.main>

    </motion.div>
}