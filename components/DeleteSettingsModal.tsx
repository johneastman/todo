import { Text } from "react-native";
import { ModalButton } from "../types";
import CustomModal from "./core/CustomModal";

type DeleteSettingsModalProps = {
    isVisible: boolean;
    onDelete: () => void;
    onCancel: () => void;
};

export default function DeleteSettingsModal(props: DeleteSettingsModalProps) {
    const { isVisible, onDelete, onCancel } = props;

    const positiveAction: ModalButton = {
        text: "Yes",
        onPress: onDelete,
    };

    const negativeAction: ModalButton = {
        text: "No",
        onPress: onCancel,
    };

    return (
        <CustomModal
            title="Are you sure you want to delete all your data?"
            isVisible={isVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
        >
            <Text>This includes your lists, items, account, and settings.</Text>
        </CustomModal>
    );
}
