import {CookieIcon} from "lucide-react";
import {Button} from "./ui/button";

import {cn} from "@/lib/utils";
import {useState, useEffect} from "react";
import Texts from "@/text/Texts";

export default function CookieConsent({
                                          demo = false, onAcceptCallback = () => {
    }, onDeclineCallback = () => {
    }
                                      }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hide, setHide] = useState(false);

    const accept = () => {
        setIsOpen(false);
        document.cookie = "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        setTimeout(() => {
            setHide(true);
        }, 700);
        onAcceptCallback();
    };

    // @ts-ignore
    const decline = () => {
        setIsOpen(false);
        setTimeout(() => {
            setHide(true);
        }, 700);
        onDeclineCallback();
    };

    useEffect(() => {
        try {
            setIsOpen(true);
            if (document.cookie.includes("cookieConsent=true")) {
                if (!demo) {
                    setIsOpen(false);
                    setTimeout(() => {
                        setHide(true);
                    }, 700);
                }
            }
        } catch (e) {
            // console.log("Error: ", e);
        }
    }, []);

    return (
        <div
            className={cn("z-[200] fixed bottom-0 right-0 w-full sm:max-w-md transition-transform duration-700", !isOpen ? "transition-[opacity,transform] translate-y-8 opacity-0" : "transition-[opacity,transform] translate-y-0 opacity-100", hide && "hidden")}>
            <div className="bg-secondary rounded-md m-2">
                <div className="grid gap-2">
                    <div className="border-b border-border h-14 flex items-center justify-between p-4">
                        <h1 className="text-lg font-medium">{Texts.WE_USE_COOKIES}</h1>
                        <CookieIcon className="h-[1.2rem] w-[1.2rem]"/>
                    </div>
                    <div className="p-4">
                        <p className="text-sm font-normal">
                            {Texts.WE_USE_COOKIE_DESCRIPTION}
                            <br/>
                            <br/>
                            <span dangerouslySetInnerHTML={{__html: Texts.BY_CLICKING_ACCEPT}}/>
                            {/*<br />*/}
                            {/*<a href="#" className="text-xs underline">Learn more.</a>*/}
                        </p>
                    </div>
                    <div className="flex gap-2 p-4 py-5 border-t border-border bg-background/20">
                        <Button onClick={accept} className="w-full">{Texts.ACCEPT}</Button>
                        {/*<Button onClick={decline} className="w-full" variant="secondary">{Texts.DECLINE}</Button>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}