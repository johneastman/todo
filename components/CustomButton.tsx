import { Animated, Pressable, Text } from "react-native";
import { LIGHT_BLUE_BUTTON } from "../utils";

type CustomButtonProps = {
    onPress?: () => void;
    text?: string;
    testId?: string;
};

export default function CustomButton(props: CustomButtonProps): JSX.Element {
    const { testId, text, onPress } = props;

    const animated = new Animated.Value(1);

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={{
                padding: 25,
                alignItems: "center",
            }}
            testID={testId}
        >
            <Animated.View style={{ opacity: animated }}>
                <Text style={{ fontSize: 20, color: LIGHT_BLUE_BUTTON }}>
                    {text}
                </Text>
            </Animated.View>
        </Pressable>
    );
}
