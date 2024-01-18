import { Text } from "react-native";
import { ListViewCellItem } from "../data/data";
import { getSelectedCells } from "../utils";
import CustomModal from "./CustomModal";

interface DeleteAllModalProps {
    isVisible: boolean;
    selectedCells: {
        areAnySelected: boolean;
        cells: ListViewCellItem[];
    };
    collectionCountDisplay: (count: number) => string;
    positiveAction: () => void;
    negativeAction: () => void;
}

export default function DeleteAllModal(
    props: DeleteAllModalProps
): JSX.Element {
    const {
        isVisible,
        selectedCells,
        collectionCountDisplay,
        positiveAction,
        negativeAction,
    } = props;

    const { cells: selectedItems, areAnySelected } = selectedCells;

    const numItemsBeingDeleted: string = collectionCountDisplay(
        selectedItems.length
    );

    const title: string = `Are you sure you want to delete everything${
        areAnySelected ? " that is selected" : ""
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
