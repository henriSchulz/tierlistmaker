import TierlistRow from "@/types/dbmodel/TierlistRow";

import CreateTierlistController from "@/pages/create-tierlist/CreateTierlistController";
import DraggableTierlistItem, {
    DropIndicator
} from "@/pages/create-tierlist/components/DraggableTierlistItem";
import {DragEvent, useState} from "react";
import TierlistItem from "@/types/dbmodel/TierlistItem";
import {motion} from "framer-motion";
import CreateTemplatePageController from "@/pages/create-template/CreateTemplatePageController";
import {isXsWindow} from "@/utils";
import {Card} from "@/components/ui/card";


interface DroppableTierProps {
    row: TierlistRow
    color: string
    controller: CreateTierlistController
    handleDragStart: (e: DragEvent, item: TierlistItem) => void
    hideLabel?: boolean
    showImageNames: boolean
}


export default function ({row, controller, color, handleDragStart, hideLabel, showImageNames}: DroppableTierProps) {


    if (!controller.states.tierlistDataState.val) return <></>

    const [active, setActive] = useState<boolean>(false);


    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const handleDragEnd = (e: DragEvent) => {

        const itemId = e.dataTransfer?.getData('itemId');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const element = getNearestIndicator(e, indicators);

        const before = element?.dataset.before || '-1';


        if (before !== itemId) {
            const copy = [...controller.states.tierlistDataState.val!];

            // Update the rowId of the item being transferred and leave the rowId of all other items as is
            const updatedCopy = copy.map(item => {
                if (item.id === itemId) {
                    return {...item, rowId: row.id};
                } else {
                    return item;
                }
            });

            const itemToTransfer = updatedCopy.find((c) => c.id === itemId);
            if (!itemToTransfer) return;

            updatedCopy.splice(updatedCopy.indexOf(itemToTransfer), 1);

            const moveToBack = before === '-1';

            if (moveToBack) {
                updatedCopy.push(itemToTransfer);
            } else {
                const insertAtIndex = updatedCopy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;
                updatedCopy.splice(insertAtIndex, 0, itemToTransfer);
            }
            controller.states.tierlistDataState.set(updatedCopy);
        }
    }

    const clearHighlights = (els?: HTMLDivElement[]) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = "0";
            // i.style.width = "2px";


        });
    };

    const highlightIndicator = (e: DragEvent) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);


        if (!el) return console.log('No element found');

        el.style.opacity = "1";
        // el.style.width = "20px";

    };

    const getNearestIndicator = (e: DragEvent, indicators: HTMLDivElement[]) => {
        const DISTANCE_OFFSET = 50;

        // Find the closest indicator based on X and Y distances
        const el = indicators.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const xOffset = e.clientX - (box.left + DISTANCE_OFFSET);
                const yOffset = e.clientY - (box.top + DISTANCE_OFFSET);

                // Calculate a combined offset based on both X and Y distances
                // (Adjust the weight factors as needed)
                const combinedOffset = Math.abs(xOffset) * 0.7 + Math.abs(yOffset) * 0.3;

                if (combinedOffset < closest.offset) {
                    return {offset: combinedOffset, element: child};
                } else {
                    return closest;
                }
            },
            {
                offset: Number.POSITIVE_INFINITY, // Initialize with a large offset
                element: null as HTMLDivElement | null,
            }
        );

        return el.element;
    };


    const getIndicators = (): HTMLDivElement[] => {
        return Array.from(document.querySelectorAll(`[data-column="${row.id}"]`));
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredItems = controller.states.tierlistDataState.val!.filter((item) => item.rowId === row.id);


    const boxSize = isXsWindow() ? 80 : 100;


    return <motion.div
        layout layoutId={row.id}
    >
        <div className="tier">
            {!hideLabel && <div style={{
                backgroundColor: color,
                display: "grid",
                placeItems: "center",
                alignItems: "center",
                minHeight: `${boxSize}px`,
                width: `${boxSize + 5}px`,
                userSelect: "none",
                borderBottomLeftRadius: "0.5rem",
                borderTopLeftRadius: "0.5rem"
            }}
                                className="overflow-hidden break-all p-2 font-bold text-center dark:text-black border tier-head">
                {row && row.name.length > 0 ? row.name : CreateTemplatePageController.DEFAULT_ROW_NAMES[row.rowNumber]}

            </div>}
            <Card
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{minHeight: `${boxSize}px`}}
                className={`w-full ${active ? "bg-gray-300/50" : "bg-gray-300/0"} flex flex-wrap ${!hideLabel && "tier-items"}`}>
                {filteredItems.map((item, index) => {
                    return <DraggableTierlistItem
                        key={item.id}
                        item={item}
                        showImageNames={showImageNames}
                        index={index}
                        handleDragStart={handleDragStart}
                        controller={controller}/>
                })}
                <DropIndicator beforeId={null} rowId={row.id}/>
            </Card>

        </div>
    </motion.div>
}
