import { useEffect, useReducer } from "react";
import { useNavigation } from "@react-navigation/core";
import {
    ListPageNavigationProp,
    CollectionViewCellType,
    MenuOption,
} from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomDrawer from "./CustomDrawer";
import { Button, Pressable, View, Text } from "react-native";
import { CollectionViewCell } from "../types";
import {
    CollectionPageViewState,
    UpdateIsDrawerVisible,
    collectionPageViewReducer,
} from "../data/reducers/collectionPageView.reducer";
import CustomButton from "./CustomButton";
import { GREY, LIGHT_BLUE_BUTTON, LIGHT_GREY } from "../utils";
import MenuOptionView from "./MenuOptionView";

function getState(): CollectionPageViewState {
    return { isDrawerVisible: false };
}

type CollectionPageViewProps = {
    menuOptions: MenuOption[];
    navigationMenuOptions?: Partial<NativeStackNavigationOptions>;
    items: CollectionViewCell[];
    itemsType: CollectionViewCellType;

    children?: React.ReactNode;
};

export default function CollectionPageView(
    props: CollectionPageViewProps
): JSX.Element {
    const { menuOptions, navigationMenuOptions, items, itemsType, children } =
        props;

    const navigation = useNavigation<ListPageNavigationProp>();

    const [collectionPageViewState, collectionPageViewDispatch] = useReducer(
        collectionPageViewReducer,
        getState()
    );
    const { isDrawerVisible } = collectionPageViewState;

    useEffect(() => {
        navigation.setOptions({
            ...navigationMenuOptions,
            headerRight: () => (
                <Button
                    title={`${itemsType} Options`}
                    onPress={() => setIsOptionsDrawerVisible(true)}
                />
            ),
        });
    }, [navigation, items]);

    const commonMenuOptions: MenuOption[] = [
        {
            text: "Import Data",
            onPress: () => navigation.navigate("Import"),
        },
        {
            text: "Export Data",
            onPress: () => navigation.navigate("Export"),
        },
        {
            text: "Settings",
            onPress: () => navigation.navigate("Settings"),
        },
    ];

    const setIsOptionsDrawerVisible = (newIsDrawerVisible: boolean) =>
        collectionPageViewDispatch(
            new UpdateIsDrawerVisible(newIsDrawerVisible)
        );

    const menuActionWrapper = (action: () => void): void => {
        // Close crawer
        setIsOptionsDrawerVisible(false);

        // Run the action
        action();
    };

    return (
        <>
            <CustomDrawer
                isVisible={isDrawerVisible}
                setIsVisible={setIsOptionsDrawerVisible}
                percentWidth={70}
            >
                <View
                    style={{
                        height: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <MenuOptionView
                        menuOptions={[...menuOptions, ...commonMenuOptions]}
                        menuActionWrapper={menuActionWrapper}
                        style={{ borderBottomWidth: 1 }}
                    />

                    <MenuOptionView
                        menuOptions={[
                            {
                                text: "Close",
                                onPress: () => setIsOptionsDrawerVisible(false),
                            },
                        ]}
                        menuActionWrapper={menuActionWrapper}
                        style={{ borderTopWidth: 1 }}
                    />
                </View>
            </CustomDrawer>
            {children}
        </>
    );
}
