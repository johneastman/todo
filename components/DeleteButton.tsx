import { Pressable, Image } from "react-native";

type DeleteButtonProps = {
    onPress: () => void;
    testId?: string;
};

export default function DeleteButton(props: DeleteButtonProps): JSX.Element {
    const { onPress, testId } = props;

    const size: number = 32;

    return (
        <Pressable onPress={onPress}>
            <Image
                style={{ width: size, height: size }}
                source={require("../assets/bin.png")}
                testID={testId}
            />
        </Pressable>
    );
}
