import { StyleProp, Text, TextStyle } from "react-native";

export enum TextSize {
    Small = 15,
    Medium = 20,
    Large = 30,
}

type CustomTextProps = {
    text: string | undefined;
    size?: TextSize;
    style?: StyleProp<TextStyle>;
    testId?: string;
    onPress?: () => void;
    disabled?: boolean;
};

export default function CustomText(props: CustomTextProps): JSX.Element {
    const { text, size, style, testId, onPress, disabled } = props;
    return (
        <Text
            testID={testId}
            style={[{ fontSize: size ?? TextSize.Small }, style]}
            onPress={onPress}
            disabled={disabled}
        >
            {text}
        </Text>
    );
}
