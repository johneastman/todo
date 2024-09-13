import { View } from "react-native";
import { AppStackNavigatorParamList } from "../types";
import CustomDrawer from "./core/CustomDrawer";
import MenuOptionsView from "./MenuOptionsView";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerMenu, DrawerMenuButton } from "../data/drawerMenu";

type CollectionPageDrawerProps = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    topMenuOptions: DrawerMenu[];
    navigation: NativeStackNavigationProp<
        AppStackNavigatorParamList,
        "Lists" | "Items"
    >;
};

export default function CollectionPageDrawer(props: CollectionPageDrawerProps) {
    const { isVisible, setIsVisible, topMenuOptions, navigation } = props;

    const menuActionWrapper = (action: () => void): void => {
        // Close drawer
        setIsVisible(false);

        // Run the action
        action();
    };

    const bottomMenuOptions: DrawerMenu[] = [
        new DrawerMenuButton({
            text: "Query",
            onPress: () => navigation.navigate("Query"),
        }),

        new DrawerMenuButton({
            text: "Settings",
            onPress: () => navigation.navigate("Settings"),
        }),

        new DrawerMenuButton({
            text: "Legal",
            onPress: () => navigation.navigate("Legal"),
        }),

        new DrawerMenuButton({
            text: "Close",
            onPress: () => setIsVisible(false),
        }),
    ];

    return (
        <CustomDrawer
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            percentWidth={70}
        >
            <View
                style={{
                    height: "100%",
                    justifyContent: "space-between",
                }}
            >
                <MenuOptionsView
                    menuOptions={topMenuOptions}
                    menuActionWrapper={menuActionWrapper}
                    style={{ borderBottomWidth: 1 }}
                />

                <MenuOptionsView
                    menuOptions={bottomMenuOptions}
                    menuActionWrapper={menuActionWrapper}
                    style={{ borderTopWidth: 1 }}
                />
            </View>
        </CustomDrawer>
    );
}
