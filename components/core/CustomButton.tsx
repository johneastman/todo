import { Animated, Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { LIGHT_BLUE_BUTTON, LIGHT_GREY } from "../../utils";

type CustomButtonProps = {
    text: string;
    onPress: () => void;
    enabledColor?: string;
    testId?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function CustomButton(props: CustomButtonProps): JSX.Element {
    const { text, onPress, enabledColor, testId, disabled, style } = props;

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
            disabled={disabled}
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={[
                style,
                {
                    alignItems: "center",
                },
            ]}
            testID={testId}
        >
            <Animated.View style={{ opacity: animated }}>
                <Text
                    style={{
                        fontSize: 20,
                        color: disabled
                            ? LIGHT_GREY
                            : enabledColor ?? LIGHT_BLUE_BUTTON,
                    }}
                    disabled={disabled}
                >
                    {text}
                </Text>
            </Animated.View>
        </Pressable>
    );
}
