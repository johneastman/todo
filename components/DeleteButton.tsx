import { RED } from "../utils";
import CustomButton from "./core/CustomButton";

type DeleteButtonProps = {
    onPress: () => void;
};

export default function DeleteButton(props: DeleteButtonProps): JSX.Element {
    const { onPress } = props;
    return <CustomButton text="Delete" enabledColor={RED} onPress={onPress} />;
}
