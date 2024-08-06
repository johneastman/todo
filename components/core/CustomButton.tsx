import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";
import { Color } from "../../utils";
import CustomText, { TextSize } from "./CustomText";

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
                <CustomText
                    text={text}
                    size={TextSize.Medium}
                    disabled={disabled}
                    style={{
                        color: disabled
                            ? Color.LightGray
                            : enabledColor ?? Color.LightBlueButton,
                    }}
                />
            </Animated.View>
        </Pressable>
    );
}
