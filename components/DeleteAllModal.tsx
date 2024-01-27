import { Text } from "react-native";
import { CollectionViewCell } from "../types";
import { cellsCountDisplay } from "../utils";
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

    const numItemsBeingDeleted: string = cellsCountDisplay(
        items[0]?.type,
        items.filter((i) => i.isSelected).length
    );

    const title: string =
        "Are you sure you want to delete everything that is selected?";

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
