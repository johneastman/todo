import { Text } from "react-native";
import { CollectionViewCell, CollectionViewCellType } from "../types";
import { cellsCountDisplay } from "../utils";
import CustomModal from "./CustomModal";

type DeleteAllModalProps = {
    isVisible: boolean;
    collectionType: CollectionViewCellType;
    numDeleted: number;
    positiveAction: () => void;
    negativeAction: () => void;
};

export default function DeleteAllModal(
    props: DeleteAllModalProps
): JSX.Element {
    const {
        isVisible,
        collectionType,
        numDeleted,
        positiveAction,
        negativeAction,
    } = props;

    const numCellsDeletedLabel: string = cellsCountDisplay(
        collectionType,
        numDeleted
    );

    return (
        <CustomModal
            title="Are you sure you want to delete everything that is selected?"
            isVisible={isVisible}
            positiveActionText="Yes"
            positiveAction={positiveAction}
            negativeActionText="No"
            negativeAction={negativeAction}
        >
            <Text>{numCellsDeletedLabel} will be deleted.</Text>
        </CustomModal>
    );
}
