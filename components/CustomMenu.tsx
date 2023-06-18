import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { Text } from "react-native";
import { ReactNode } from "react";
import { useRoute } from "@react-navigation/native";
import { LIGHT_BLUE } from "../utils";

interface CustomMenuProps {
    children?: ReactNode;
}

export default function CustomMenu(props: CustomMenuProps): JSX.Element {
    const route = useRoute(); // used to create unique testId for jest tests.

    return (
        <Menu>
            <MenuTrigger testID={`options-menu-trigger-${route.name}`}>
                <Text
                    style={{
                        color: LIGHT_BLUE,
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    Options
                </Text>
            </MenuTrigger>
            <MenuOptions>{props.children}</MenuOptions>
        </Menu>
    );
}
