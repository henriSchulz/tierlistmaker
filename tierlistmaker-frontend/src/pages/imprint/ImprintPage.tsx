
import {Helmet} from "react-helmet";


export default function () {


    return <div className="max-w-screen-lg mt-8 mb-8 mx-auto border-2 bg-white border-gray-100 rounded-2xl">

        <Helmet>
            <title>
                Imprint - Tierlistmaker
            </title>
        </Helmet>

        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">Imprint</h1>

            <h2 className="text-2xl font-bold mb-2">Responsible for the content</h2>

            <p className="mb-2">Henri Schulz</p>

            <p>Information in accordance with Section 5 TMG.</p>

            <h2 className="text-2xl font-bold mb-2">Contact</h2>

            <span className="mb-2">
            Henri Schulz
            </span>
            <br/>
            <span className="mb-2">
            Klevergarten 6
        </span>
            <br/>
            <span className="mb-2">
            38104 Braunschweig
        </span>
            <br/>
            <span>
            contact@tierlistmaker.org
        </span>
        </div>


    </div>

}