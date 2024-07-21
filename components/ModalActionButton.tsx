import { ModalButton } from "../types";
import CustomButton from "./core/CustomButton";

type ModalActionButtonProps = {
    action?: ModalButton;
};

export default function ModalActionButton(
    props: ModalActionButtonProps
): JSX.Element {
    const { action } = props;

    if (action !== undefined) {
        const { text, onPress, disabled } = action;

        return (
            <CustomButton
                onPress={onPress}
                text={text}
                testId={`custom-modal-${text}`}
                disabled={disabled}
                style={{ padding: 25 }}
            />
        );
    }

    return <></>;
}
