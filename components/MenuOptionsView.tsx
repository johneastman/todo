import { StyleProp, View, ViewStyle } from "react-native";
import { DividedMenuOption } from "../types";
import CustomButton from "./core/CustomButton";
import { Color } from "../utils";
import CustomFlatList from "./core/CustomFlatList";
import MenuOptionView from "./MenuOptionView";
import VerticalLine from "./core/VerticalLine";

type MenuOptionsViewProps = {
    menuOptions: DividedMenuOption[];
    menuActionWrapper: (action: () => void) => void;
    style?: StyleProp<ViewStyle>;
};

export default function MenuOptionsView(
    props: MenuOptionsViewProps
): JSX.Element {
    const { menuOptions, menuActionWrapper, style } = props;

    const renderMenuButton = (option: DividedMenuOption, index: number) => {
        const { primary, secondary } = option;

        return (
            <View
                style={[
                    style,
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <MenuOptionView
                        menuOption={primary}
                        menuActionWrapper={menuActionWrapper}
                    />
                </View>
                {secondary !== undefined && (
                    <>
                        <VerticalLine height="60%" />
                        <View style={{ flex: 1 }}>
                            <MenuOptionView
                                menuOption={secondary}
                                menuActionWrapper={menuActionWrapper}
                            />
                        </View>
                    </>
                )}
            </View>
        );
    };

    return (
        <CustomFlatList data={menuOptions} renderElement={renderMenuButton} />
    );
}
