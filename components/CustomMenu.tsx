import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { Text } from "react-native";
import { ReactNode } from "react";
import { useRoute } from "@react-navigation/native";
import { MenuOption } from "../data/data";
import CustomMenuOption from "./CustomMenuOption";

interface CustomMenuProps {
    menuOptions: MenuOption[];
}

export default function CustomMenu(props: CustomMenuProps): JSX.Element {
    const route = useRoute(); // used to create unique testId for jest tests.

    const { menuOptions } = props;

    return (
        <Menu>
            <MenuTrigger testID={`options-menu-trigger-${route.name}`}>
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: "bold",
                    }}
                >
                    •••
                </Text>
            </MenuTrigger>
            <MenuOptions>
                {menuOptions.map((menuDatum: MenuOption, index: number) => (
                    <CustomMenuOption
                        text={menuDatum.text}
                        onSelect={menuDatum.onPress}
                        disabled={menuDatum.disabled}
                        textStyle={menuDatum.textStyle}
                        key={index}
                    />
                ))}
            </MenuOptions>
        </Menu>
    );
}
