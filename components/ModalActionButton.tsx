import { LIGHT_BLUE_BUTTON } from "../utils";
import CustomButton from "./core/CustomButton";

type ModalActionButtonProps = {
    text: string;
    onPress: () => void;
    testId: string;
};

export default function ModalActionButton(
    props: ModalActionButtonProps
): JSX.Element {
    const { text, onPress, testId } = props;

    return (
        <CustomButton
            onPress={onPress}
            text={text}
            testId={testId}
            style={{ padding: 25 }}
        />
    );
}
