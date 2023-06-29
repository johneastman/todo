import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { Text } from "react-native";
import { ReactNode } from "react";
import { useRoute } from "@react-navigation/native";

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
                        fontSize: 25,
                        fontWeight: "bold",
                    }}
                >
                    •••
                </Text>
            </MenuTrigger>
            {props.children !== undefined ? (
                <MenuOptions>{props.children}</MenuOptions>
            ) : null}
        </Menu>
    );
}
