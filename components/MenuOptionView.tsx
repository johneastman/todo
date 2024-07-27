import { StyleProp, View, ViewStyle } from "react-native";
import { MenuOption } from "../types";
import CustomButton from "./core/CustomButton";
import { Color } from "../utils";
import CustomFlatList from "./core/CustomFlatList";

type MenuOptionViewProps = {
    menuOptions: MenuOption[];
    menuActionWrapper: (action: () => void) => void;
    style?: StyleProp<ViewStyle>;
};

export default function MenuOptionView(
    props: MenuOptionViewProps
): JSX.Element {
    const { menuOptions, menuActionWrapper, style } = props;

    const renderMenuButton = (option: MenuOption, index: number) => {
        const { text, onPress, disabled, testId, color } = option;

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
    };

    return (
        <CustomFlatList data={menuOptions} renderElement={renderMenuButton} />
    );
}
