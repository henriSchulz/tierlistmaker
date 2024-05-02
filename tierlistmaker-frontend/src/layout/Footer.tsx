import {Separator} from "@/components/ui/separator";
import {useNavigate} from "react-router-dom";
import Paths from "@/Paths";

export default function Footer() {
    const navigate = useNavigate()
    return (
        <div className="lg:mx-20 mx-5 mt-20 "
        ><Separator/>
            <div className="py-4">

                <div className="mx-auto grid space-y-2 md:flex md:justify-between items-center">
                    <div className="text-gray-400">
                        <a onClick={() => navigate(Paths.TERMS_OF_SERVICE)}
                           className="mr-4 hover:text-gray-300 cursor-pointer">Terms
                            of Service</a>
                        <a onClick={() => navigate(Paths.PRIVACY_POLICY)}
                           className="mr-4 hover:text-gray-300 cursor-pointer">Privacy Policy</a>

                        <a onClick={() => navigate(Paths.IMPRINT)}
                           className="hover:text-gray-300 cursor-pointer">Imprint</a>
                    </div>

                    <div className="text-gray-400 text-sm">
                        © 2024 Tierlistmaker.org
                    </div>
                    <span className="text-sm text-gray-400">Graphics by: <a className="text-blue-500 hover:underline"
                                                                            href="https://storyset.com/work">Storyset</a></span>
                </div>

            </div>
        </div>
    );
}
