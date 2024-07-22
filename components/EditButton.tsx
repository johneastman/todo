import { Image, Pressable } from "react-native";
import CustomButton from "./core/CustomButton";

type EditButtonProps = {
    onPress: () => void;
};

export default function EditButton(props: EditButtonProps): JSX.Element {
    const { onPress } = props;

    const size: number = 32;

    return (
        <Pressable onPress={onPress}>
            <Image
                style={{ width: size, height: size }}
                source={require("../assets/edit.png")}
                testID="edit-button"
            />
        </Pressable>
    );
}
