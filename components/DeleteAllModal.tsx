import { Text } from "react-native";
import { CollectionViewCell } from "../types";
import { areCellsSelected, cellsCountDisplay } from "../utils";
import CustomModal from "./CustomModal";

type DeleteAllModalProps = {
    isVisible: boolean;
    items: CollectionViewCell[];
    positiveAction: () => void;
    negativeAction: () => void;
};

export default function DeleteAllModal(
    props: DeleteAllModalProps
): JSX.Element {
    const { isVisible, items, positiveAction, negativeAction } = props;

    const areItemsSelected: boolean = areCellsSelected(items);

    const numItemsBeingDeleted: string = cellsCountDisplay(
        items[0]?.type,
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
