import { Image, Pressable } from "react-native";

type EditButtonProps = {
    onPress: () => void;
    testId?: string;
};

export default function EditButton(props: EditButtonProps): JSX.Element {
    const { onPress, testId } = props;

    const size: number = 32;

    return (
        <Pressable onPress={onPress}>
            <Image
                style={{ width: size, height: size }}
                source={require("../assets/edit.png")}
                testID={testId}
            />
        </Pressable>
    );
}
