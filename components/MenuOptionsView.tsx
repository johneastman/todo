import { StyleProp, View, ViewStyle } from "react-native";
import CustomFlatList from "./core/CustomFlatList";
import MenuOptionView from "./MenuOptionView";
import VerticalLine from "./core/VerticalLine";
import {
    DrawerMenu,
    DrawerMenuButton,
    DrawerMenuDividedButton,
    DrawerMenuPicker,
} from "../data/drawerMenu";
import CustomPicker from "./core/CustomPicker";
import { SelectionValue } from "../types";

type MenuOptionsViewProps = {
    menuOptions: DrawerMenu[];
    menuActionWrapper: (action: () => void) => void;
    style?: StyleProp<ViewStyle>;
};

function getView(
    option: DrawerMenu,
    menuActionWrapper: (action: () => void) => void
): JSX.Element {
    switch (option.type) {
        case "BUTTON": {
            const { menuOption } = option as DrawerMenuButton;

            return (
                <MenuOptionView
                    menuOption={menuOption}
                    menuActionWrapper={menuActionWrapper}
                />
            );
        }

        case "DIVIDED_BUTTON": {
            const { first, second } = option as DrawerMenuDividedButton;

            return (
                <>
                    <View style={{ flex: 1 }}>
                        <MenuOptionView
                            menuOption={first}
                            menuActionWrapper={menuActionWrapper}
                        />
                    </View>
                    <VerticalLine height="60%" />
                    <View style={{ flex: 1 }}>
                        <MenuOptionView
                            menuOption={second}
                            menuActionWrapper={menuActionWrapper}
                        />
                    </View>
                </>
            );
        }

        case "PICKER": {
            const { placeHolder, data, runAction } = option as DrawerMenuPicker;

            const pickerData: SelectionValue<number[]>[] = data.map(
                ([cellSelect, method]) => ({
                    label: cellSelect,
                    value: method,
                })
            );

            return (
                <CustomPicker
                    placeholder={placeHolder}
                    data={pickerData}
                    onSelect={(indices: number[]) =>
                        menuActionWrapper(() => runAction(indices))
                    }
                    style={{ paddingVertical: 10, width: "auto" }}
                />
            );
        }

        default:
            throw Error(`Unknown drawer menu option type: ${option.type}`);
    }
}

export default function MenuOptionsView(
    props: MenuOptionsViewProps
): JSX.Element {
    const { menuOptions, menuActionWrapper, style } = props;

    const renderMenuButton = (option: DrawerMenu, index: number) => (
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
            {getView(option, menuActionWrapper)}
        </View>
    );

    return (
        <CustomFlatList data={menuOptions} renderElement={renderMenuButton} />
    );
}
