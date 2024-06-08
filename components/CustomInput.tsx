import { TextInput, StyleSheet } from "react-native";

type CustomInputProps = {
    value?: string;
    onChangeText: (text: string) => void;
    autoFocus?: boolean;
    placeholder?: string;
    testID?: string;
};

export default function CustomInput(props: CustomInputProps): JSX.Element {
    const { value, onChangeText, placeholder, testID, autoFocus } = props;
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoFocus={autoFocus}
            testID={testID}
            style={styles.input}
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
