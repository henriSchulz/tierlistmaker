import {useState} from "react";
import {cn} from "@/lib/utils";
import {setClipboard} from "@/utils";
import {toast} from "sonner";
import Texts from "@/text/Texts";
import CustomButton from "@/components/custom/Button";

interface CopyToClipboardProps {
    text: string

}


export default function ({text}: CopyToClipboardProps) {

    const [isActive, setActive] = useState(false)

    const onClick = () => {
        setActive(true)
        setClipboard(text).then(() => {
                toast.success(Texts.LINK_COPIED)
                setTimeout(() => setActive(false), 5000)

            }
        )


    }


    return <div
        className="relative w-full flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2">

        <input type="text" value={text} disabled readOnly
               className="overflow-hidden select-text w-full py-1 px-2 text-xl font-bold focus:outline-none md:py-2 md:px-4 md:pr-10 md:text-2xl"
        />

        <CustomButton variant="icon" onClick={onClick}
                className="absolute end-2 rounded-lg p-2 inline-flex items-center justify-center">
                     <span id="default-icon-course-url" className={cn(isActive && "hidden")}>
                         <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20">
                             <path
                                 d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                             </svg>
                     </span>

            <span id="success-icon-course-url" className={cn("inline-flex items-center", !isActive && "hidden")}>
                         <svg className="w-6 h-6 text-blue-700 dark:text-blue-500" aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none" viewBox="0 0 16 12">
                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                   d="M1 5.917 5.724 10.5 15 1.5"/>
                         </svg>
                     </span>

        </CustomButton>
    </div>

}