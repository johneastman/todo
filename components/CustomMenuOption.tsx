import { MenuOption } from "react-native-popup-menu";
import { StyleSheet, StyleProp, Text, TextStyle } from "react-native";

interface CustomMenuOptionProps {
    text: string;
    onSelect: () => void;
    disabled?: boolean;
    textStyle?: StyleProp<TextStyle>;
}

export default function CustomMenuOption(
    props: CustomMenuOptionProps
): JSX.Element {
    const { text, onSelect, disabled, textStyle } = props;

    return (
        <MenuOption onSelect={onSelect} disabled={disabled}>
            <Text style={[styles.popupMenuText, textStyle]}>{text}</Text>
        </MenuOption>
    );
}

const styles = StyleSheet.create({
    popupMenuText: {
        fontSize: 18,
        padding: 8,
    },
});
