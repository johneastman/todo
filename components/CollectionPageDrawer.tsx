import { View } from "react-native";
import { AppStackNavigatorParamList, DividedMenuOption } from "../types";
import CustomDrawer from "./core/CustomDrawer";
import MenuOptionsView from "./MenuOptionsView";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type CollectionPageDrawerProps = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    topMenuOptions: DividedMenuOption[];
    navigation: NativeStackNavigationProp<
        AppStackNavigatorParamList,
        "Lists" | "Items"
    >;
};

export default function CollectionPageDrawer(props: CollectionPageDrawerProps) {
    const { isVisible, setIsVisible, topMenuOptions, navigation } = props;

    const menuActionWrapper = (action: () => void): void => {
        // Close crawer
        setIsVisible(false);

        // Run the action
        action();
    };

    const bottomMenuOptions: DividedMenuOption[] = [
        {
            primary: {
                text: "Settings",
                onPress: () => navigation.navigate("Settings"),
            },
        },
        {
            primary: {
                text: "Legal",
                onPress: () => navigation.navigate("Legal"),
            },
        },
        {
            primary: {
                text: "Close",
                onPress: () => setIsVisible(false),
            },
        },
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
