import { StyleProp, View, ViewStyle } from "react-native";
import { MenuOption } from "../types";
import CustomButton from "./core/CustomButton";
import { GREY, LIGHT_BLUE_BUTTON } from "../utils";

type MenuOptionViewProps = {
    menuOptions: MenuOption[];
    menuActionWrapper: (action: () => void) => void;
    style?: StyleProp<ViewStyle>;
};

export default function MenuOptionView(
    props: MenuOptionViewProps
): JSX.Element {
    const { menuOptions, menuActionWrapper, style } = props;

    return (
        <View>
            {menuOptions.map(
                ({ disabled, onPress, testId, color, text }, index, array) => (
                    <CustomButton
                        text={text}
                        onPress={() => menuActionWrapper(onPress)}
                        enabledColor={color ?? LIGHT_BLUE_BUTTON}
                        testId={testId}
                        disabled={disabled}
                        style={[
                            {
                                paddingVertical: 10,
                                borderColor: GREY,
                            },
                            style,
                        ]}
                        key={index}
                    />
                )
            )}
        </View>
    );
}
