import { useContext, useEffect, useReducer } from "react";
import { useNavigation } from "@react-navigation/core";
import {
    ListPageNavigationProp,
    CollectionViewCellType,
    MenuOption,
} from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomDrawer from "./core/CustomDrawer";
import { View } from "react-native";
import { CollectionViewCell } from "../types";
import {
    CollectionPageViewState,
    UpdateIsDrawerVisible,
    collectionPageViewReducer,
} from "../data/reducers/collectionPageView.reducer";
import MenuOptionView from "./MenuOptionView";
import CustomButton from "./core/CustomButton";
import { ListsStateContext } from "../contexts/listsState.context";

function getState(): CollectionPageViewState {
    return { isDrawerVisible: false };
}

type CollectionPageViewProps = {
    menuOptions: MenuOption[];
    navigationMenuOptions?: Partial<NativeStackNavigationOptions>;
    items: CollectionViewCell[];
    itemsType: CollectionViewCellType;

    setActionsModalVisible: (isVisible: boolean) => void;

    children?: React.ReactNode;
};

export default function CollectionPageView(
    props: CollectionPageViewProps
): JSX.Element {
    const {
        menuOptions,
        navigationMenuOptions,
        items,
        itemsType,
        setActionsModalVisible,
        children,
    } = props;

    const navigation = useNavigation<ListPageNavigationProp>();

    const listsState = useContext(ListsStateContext);
    const { listsStateDispatch } = listsState;

    const [collectionPageViewState, collectionPageViewDispatch] = useReducer(
        collectionPageViewReducer,
        getState()
    );
    const { isDrawerVisible } = collectionPageViewState;

    useEffect(() => {
        navigation.setOptions({
            ...navigationMenuOptions,
            headerRight: () => (
                <CustomButton
                    text={`${itemsType} Options`}
                    onPress={() => setIsOptionsDrawerVisible(true)}
                />
            ),
        });
    }, [navigation, items]);

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
                        menuOptions={menuOptions}
                        menuActionWrapper={menuActionWrapper}
                        style={{ borderBottomWidth: 1 }}
                    />

                    <MenuOptionView
                        menuOptions={[
                            {
                                text: "Actions",
                                onPress: () => setActionsModalVisible(true),
                            },
                            {
                                text: "Settings",
                                onPress: () => navigation.navigate("Settings"),
                            },
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
