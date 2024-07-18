import { useEffect, useReducer } from "react";
import { useNavigation } from "@react-navigation/core";
import {
    ListPageNavigationProp,
    CollectionViewCellType,
    MenuOption,
} from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomDrawer from "./core/CustomDrawer";
import { View } from "react-native";
import {
    CollectionPageViewState,
    UpdateIsDrawerVisible,
    collectionPageViewReducer,
} from "../data/reducers/collectionPageView.reducer";
import MenuOptionView from "./MenuOptionView";
import CustomButton from "./core/CustomButton";
import CustomList from "./core/CustomList";
import { RenderItemParams } from "react-native-draggable-flatlist";

function getState(): CollectionPageViewState {
    return { isDrawerVisible: false };
}

type CollectionPageViewProps<T> = {
    menuOptions: MenuOption[];
    navigationMenuOptions?: Partial<NativeStackNavigationOptions>;
    cells: T[];
    onDragEnd: (data: T[]) => void;
    renderItem: (params: RenderItemParams<T>) => JSX.Element;
    cellType: CollectionViewCellType;

    setActionsModalVisible: (isVisible: boolean) => void;

    children?: React.ReactNode;
};

export default function CollectionPageView<T>(
    props: CollectionPageViewProps<T>
): JSX.Element {
    const {
        menuOptions,
        navigationMenuOptions,
        cells,
        onDragEnd,
        renderItem,
        cellType,
        setActionsModalVisible,
        children,
    } = props;

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
                <CustomButton
                    text={`${cellType} Options`}
                    onPress={() => setIsOptionsDrawerVisible(true)}
                />
            ),
        });
    }, [navigation, cells]);

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
                        menuOptions={[
                            {
                                // Despite being a common menu option, this button should be the first option
                                // in the top menu for ease of access.
                                text: "Actions",
                                onPress: () => setActionsModalVisible(true),
                            },
                            ...menuOptions,
                        ]}
                        menuActionWrapper={menuActionWrapper}
                        style={{ borderBottomWidth: 1 }}
                    />

                    <MenuOptionView
                        menuOptions={[
                            {
                                text: "Settings",
                                onPress: () => navigation.navigate("Settings"),
                            },
                            {
                                text: "Legal",
                                onPress: () => navigation.navigate("Legal"),
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
            <CustomList
                items={cells}
                renderItem={renderItem}
                drag={({ data }) => onDragEnd(data)}
            />
        </>
    );
}
