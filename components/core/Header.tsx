import { StyleProp, TextStyle } from "react-native";
import CustomText, { TextSize } from "./CustomText";

type HeaderProps = {
    text: string;
    style?: StyleProp<TextStyle>;
    testID?: string;
};

export default function Header(props: HeaderProps): JSX.Element {
    const { text, style, testID } = props;

    return (
        <CustomText
            text={text}
            testId={testID}
            style={style}
            size={TextSize.Medium}
        />
    );
}
