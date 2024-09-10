import { StyleProp, View, ViewStyle } from "react-native";
import CustomFlatList from "./core/CustomFlatList";
import MenuOptionView from "./MenuOptionView";
import VerticalLine from "./core/VerticalLine";
import {
    DrawerMenu,
    DrawerMenuButton,
    DrawerMenuDividedButton,
} from "../data/drawerMenu";

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
