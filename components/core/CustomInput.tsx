import { useRef } from "react";
import { TextInput, StyleSheet, TextStyle, StyleProp } from "react-native";

type CustomInputProps = {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    testID?: string;
    style?: StyleProp<TextStyle>;
    multiline?: boolean;
};

export default function CustomInput(props: CustomInputProps): JSX.Element {
    const {
        value,
        onChangeText,
        placeholder,
        autoFocus,
        testID,
        style,
        multiline,
    } = props;

    return (
        <TextInput
            multiline={multiline}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoFocus={autoFocus}
            testID={testID}
            style={[styles.input, style]}
        />
    );
}

export const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});
