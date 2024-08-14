import { useContext, useEffect, useReducer } from "react";
import {
    AppStackNavigatorParamList,
    CollectionViewCellType,
    MenuOption,
} from "../types";
import {
    NativeStackNavigationOptions,
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
    CollectionPageViewState,
    UpdateIsDrawerVisible,
    collectionPageViewReducer,
} from "../data/reducers/collectionPageView.reducer";
import CustomButton from "./core/CustomButton";
import CustomList from "./core/CustomList";
import { RenderItemParams } from "react-native-draggable-flatlist";
import CollectionViewHeader from "./CollectionViewHeader";
import CollectionPageDrawer from "./CollectionPageDrawer";
import { LoginContext } from "../contexts/loginState.context";
import { Logout } from "../data/reducers/loginState.reducer";

function getState(): CollectionPageViewState {
    return { isDrawerVisible: false };
}

type CollectionPageViewProps<T> = {
    menuOptions: MenuOption[];
    navigationOptions?: Partial<NativeStackNavigationOptions>;
    cells: T[];
    onDragEnd: (data: T[]) => void;
    renderItem: (params: RenderItemParams<T>) => JSX.Element;
    cellType: CollectionViewCellType;
    setActionsModalVisible: (isVisible: boolean) => void;
    setIsAddUpdateModalVisible: (isVisible: boolean, cellIndex: number) => void;
    headerString: string;
    navigation: NativeStackNavigationProp<
        AppStackNavigatorParamList,
        "Lists" | "Items"
    >;
};

export default function CollectionPageView<T>(
    props: CollectionPageViewProps<T>
): JSX.Element {
    const {
        menuOptions,
        navigationOptions,
        cells,
        onDragEnd,
        renderItem,
        cellType,
        setActionsModalVisible,
        setIsAddUpdateModalVisible,
        headerString,
        navigation,
    } = props;

    const [collectionPageViewState, collectionPageViewDispatch] = useReducer(
        collectionPageViewReducer,
        getState()
    );
    const { isDrawerVisible } = collectionPageViewState;

    const { loginStateDispatch } = useContext(LoginContext);

    const topMenuOptions: MenuOption[] = [
        {
            // Despite being a common menu option, this button should be the first option
            // in the top menu for ease of access.
            text: "Actions",
            onPress: () => setActionsModalVisible(true),
        },
        ...menuOptions,
    ];

    const bottomMenuOptions: MenuOption[] = [
        {
            text: "Logout",
            onPress: () => {
                loginStateDispatch(new Logout());
                navigation.navigate("Login");
            },
        },
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
    ];

    const setIsOptionsDrawerVisible = (newIsDrawerVisible: boolean) =>
        collectionPageViewDispatch(
            new UpdateIsDrawerVisible(newIsDrawerVisible)
        );

    useEffect(() => {
        navigation.setOptions({
            ...navigationOptions,
            headerRight: () => (
                <CustomButton
                    text={`${cellType} Options`}
                    onPress={() => setIsOptionsDrawerVisible(true)}
                />
            ),
        });
    }, [navigation, cells]);

    const menuActionWrapper = (action: () => void): void => {
        // Close crawer
        setIsOptionsDrawerVisible(false);

        // Run the action
        action();
    };

    return (
        <>
            <CollectionPageDrawer
                isVisible={isDrawerVisible}
                setIsVisible={setIsOptionsDrawerVisible}
                topMenuOptions={topMenuOptions}
                bottomMenuOptions={bottomMenuOptions}
                menuActionWrapper={menuActionWrapper}
            />

            <CollectionViewHeader
                title={headerString}
                collectionType={cellType}
                setAddUpdateModalVisible={setIsAddUpdateModalVisible}
            />

            <CustomList
                items={cells}
                renderItem={renderItem}
                drag={({ data }) => onDragEnd(data)}
            />
        </>
    );
}
