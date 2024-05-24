import TierlistRow from "@/types/dbmodel/TierlistRow";
import {Card} from "@/components/ui/card";

import {Box} from "@/components/ui/box";
import {DragEvent} from "react";

import {motion} from "framer-motion";
import CreateTemplateController from "@/features/create-template/CreateTemplateController";
import SharedTierlistController from "@/pages/shared/SharedTierlistController";
import TierlistItem from "@/pages/shared/components/TierlistItem";
import TTierlistItem from "@/types/dbmodel/TierlistItem";


interface TierProps {
    row: TierlistRow
    color: string
    controller: SharedTierlistController
    handleDragStart: (e: DragEvent, item: TTierlistItem) => void
    hideLabel?: boolean
    showImageNames: boolean
}


export default function ({row, controller, color, hideLabel, showImageNames}: TierProps) {


    if (!controller.states.tierlistDataState.val) return <></>





    const filteredItems = controller.states.tierlistDataState.val!.filter((item) => item.rowId === row.id);

    return <motion.div
        layout layoutId={row.id}
    >
        <Card key={row.id} className="w-full flex flex-row mb-2">
            {!hideLabel && <div style={{
                backgroundColor: color,
                display: "grid",
                placeItems: "center",
                alignItems: "center"
            }}
                                className="w-32 max-w-32 overflow-hidden break-all border-r p-2 font-bold rounded text-center min-h-[100px] dark:text-black">
                {row && row.name.length > 0 ? row.name : CreateTemplateController.DEFAULT_ROW_NAMES[row.rowNumber]}

            </div>}
            <Box
                className={`w-full min-h-[100px] flex flex-wrap`}>
                {filteredItems.map((item, index) => {
                    return <TierlistItem
                        key={item.id}
                        item={item}
                        showImageNames={showImageNames}
                        index={index}
                        controller={controller}/>
                })}

            </Box>

        </Card>
    </motion.div>
}
