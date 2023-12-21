import { StyleProp, Text, TextStyle } from "react-native";

interface HeaderProps {
    text: string | number;
    style?: StyleProp<TextStyle>;
    testID?: string;
}

export default function Header(props: HeaderProps): JSX.Element {
    const { text, style, testID } = props;

    return (
        <Text testID={testID} style={[style, { fontSize: 20 }]}>
            {text}
        </Text>
    );
}
