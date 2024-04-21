import TierlistItem from "@/types/dbmodel/TierlistItem";

import EditTemplateController from "@/pages/edit-template/EditTemplateController";
import {useState} from "react";
import {Trash} from "lucide-react";
import {Box} from "@/components/ui/box";


interface EditTierlistItemProps {
    item: TierlistItem
    controller: EditTemplateController
}

export default function ({item, controller}: EditTierlistItemProps) {

    const [hovering, setHovering] = useState(false);

    const onHover = () => {
        if (hovering) return;
        setHovering(true);
    }

    const onLeave = () => {
        setHovering(false);
    }




    return <Box onMouseEnter={onHover} onMouseLeave={onLeave}
                className={`relative delete-tierlist-item`}
                onClick={() => controller.onDeleteItem(item.id)}
    >
        <img
            key={item.id}
            height={60} width={60}
            src={controller.getTierlistItemImageUrl(controller.states.tierlistState.val!.id, item.id)}
            className={`aspect-square object-fill object-center selector `}
        />

        {hovering && <div className="delete-tierlist-item-trash">
            <Trash/>
        </div>}
    </Box>

}