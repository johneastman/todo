import { StyleProp, ViewStyle } from "react-native";
import { MenuOption } from "../types";
import CustomButton from "./core/CustomButton";
import { Color } from "../utils";

type MenuOptionViewProps = {
    menuOption: MenuOption;
    menuActionWrapper: (action: () => void) => void;
    style?: StyleProp<ViewStyle>;
};

export default function MenuOptionView(props: MenuOptionViewProps) {
    const {
        menuOption: { text, onPress, disabled, testId, color },
        style,
        menuActionWrapper,
    } = props;

    return (
        <CustomButton
            text={text}
            onPress={() => menuActionWrapper(onPress)}
            enabledColor={color}
            testId={testId}
            disabled={disabled}
            style={[
                {
                    paddingVertical: 10,
                    borderColor: Color.Gray,
                },
                style,
            ]}
        />
    );
}
