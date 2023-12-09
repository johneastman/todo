import { Text } from "react-native";

import { ListViewCellItem } from "../data/data";
import {
    areCellsSelected,
    itemsCountDisplay,
    listsCountDisplay,
} from "../utils";
import CustomModal from "./CustomModal";

interface DeleteAllModalProps {
    isVisible: boolean;
    items: ListViewCellItem[];
    positiveAction: () => void;
    negativeAction: () => void;
}

export default function DeleteAllModal(
    props: DeleteAllModalProps
): JSX.Element {
    const { isVisible, items, positiveAction, negativeAction } = props;

    const areItemsSelected: boolean = areCellsSelected(items);

    // Change wording based on items' type (List, Item, etc.).
    //
    // if items is empty, it will be undefined in the type check
    const itemCountMethod: (count: number) => string =
        items[0]?.type === "List" ? listsCountDisplay : itemsCountDisplay;

    const numItemsBeingDeleted: string = itemCountMethod(
        areItemsSelected
            ? items.filter((i) => i.isSelected).length
            : items.length
    );

    const title: string = `Are you sure you want to delete everything${
        areItemsSelected ? " that is selected" : ""
    }?`;

    return (
        <CustomModal
            title={title}
            isVisible={isVisible}
            positiveActionText={"Yes"}
            positiveAction={positiveAction}
            negativeActionText={"No"}
            negativeAction={negativeAction}
        >
            <Text>{numItemsBeingDeleted} will be deleted.</Text>
        </CustomModal>
    );
}