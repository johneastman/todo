import { StyleProp, View, ViewStyle } from "react-native";
import { MenuOption } from "../types";
import CustomButton from "./core/CustomButton";
import { Color } from "../utils";

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
                ({ disabled, onPress, testId, color, text }, index) => (
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
                        key={index}
                    />
                )
            )}
        </View>
    );
}
