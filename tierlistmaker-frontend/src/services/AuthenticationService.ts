import Client from "../types/Client";


import {createUserWithEmailAndPassword, getRedirectResult} from "firebase/auth";
import {auth, provider} from "@/config/firebaseConfig";

import {wait} from "@/utils";
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import Paths from "@/Paths";
import RequestBuilder from "@/lib/RequestBuilder";
import Settings from "@/Settings";


export default class AuthenticationService {

    public static current: Client | null = null

    // returns true if the user is logged in

    public static async init(): Promise<boolean> {

        await getRedirectResult(auth)

        const googleUser = auth.currentUser

        if (googleUser) {
            const idToken = await googleUser.getIdToken()

            this.current = {
                userName: googleUser!.displayName ?? undefined,
                email: googleUser!.email ?? "",
                id: googleUser!.uid,
                token: idToken,
                imgUrl: googleUser!.photoURL ?? ""
            }

            return true
        } else {
            return false
        }
    }

    public static async signInWithGoogle(redirectUrl?: string | null): Promise<void> {
        await signInWithPopup(auth, provider)
        await wait(100)
        window.location.href = redirectUrl ?? Paths.HOME
    }

    public static async signInWithEmailPassword(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password)
        await wait(100)
        window.location.href = Paths.HOME
    }

    public static async createWithEmailPassword(email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(auth, email, password)
        await wait(100)
        window.location.href = Paths.HOME
    }

    public static async signOut(): Promise<void> {
        await auth.signOut()
        window.location.href = Paths.HOME
    }


    public static async deleteClient() {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_URL}/deleteClient`,
            method: "DELETE",
            token: this.current?.token
        })

        await request.send()
        window.location.href = "/"
    }


}