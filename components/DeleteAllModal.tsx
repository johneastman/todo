import { CollectionViewCellType, ModalButton } from "../types";
import { cellsCountDisplay } from "../utils";
import CustomModal from "./core/CustomModal";
import CustomText from "./core/CustomText";

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

    const positiveActionButton: ModalButton = {
        text: "Yes",
        onPress: positiveAction,
    };

    const negativeActionButton: ModalButton = {
        text: "No",
        onPress: negativeAction,
    };

    return (
        <CustomModal
            title="Are you sure you want to delete everything that is selected?"
            isVisible={isVisible}
            positiveAction={positiveActionButton}
            negativeAction={negativeActionButton}
        >
            <CustomText text={`${numCellsDeletedLabel} will be deleted.`} />
        </CustomModal>
    );
}
