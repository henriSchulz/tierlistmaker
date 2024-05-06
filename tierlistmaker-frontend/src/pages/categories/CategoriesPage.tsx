import {useAuthDone} from "@/App";
import {useEffect, useState} from "react";
import CategoriesController from "@/pages/categories/CategoriesController";
import Texts from "@/text/Texts";
import CategoryCard from "@/pages/categories/components/CategoryCard";
import {Helmet} from "react-helmet";


export default function () {

    const [initDone, setInitDone] = useState<boolean>(false)

    const authDone = useAuthDone()

    const controller = new CategoriesController({
        states: {
            initDoneState: {val: initDone, set: setInitDone}
        }
    })


    useEffect(() => {
        if (!authDone) return

        controller.init()

    }, [authDone])

    return <div>

        <Helmet>
            <title>
                {Texts.CATEGORIES} - Tierlistmaker
            </title>
        </Helmet>


        <div className="lg:mx-20 mx-5 mt-8">

            <h1 className="text-4xl font-bold mb-4">{Texts.CATEGORIES}</h1>

            <p className="text-muted-foreground text-lg leading-7 mt-6 mb-6">
                {Texts.CATEGORIES_PAGE_DESCRIPTION}
            </p>

            <div className="w-full whitespace-nowrap">
                <div className="flex flex-wrap gap-4">
                    {Object.entries(Texts.SELECTION_CATEGORIES).map(([key, value]) => {
                        return <CategoryCard key={key} categoryId={key} categoryName={value}/>
                    })}
                </div>
            </div>

        </div>


    </div>
}