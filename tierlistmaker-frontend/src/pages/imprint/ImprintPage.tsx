import {Card} from "@/components/ui/card";


export default function () {


    return <Card className="lg:mx-20 mx-5 mt-8 mb-8">
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


    </Card>

}