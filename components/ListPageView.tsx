import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
    ListPageNavigationProp,
    CollectionViewCellType,
    MenuOption,
} from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomDrawer from "./CustomDrawer";
import { Button, View } from "react-native";
import { ListViewCell } from "../types";

interface ListPageViewProps {
    menuOptions: MenuOption[];
    navigationMenuOptions?: Partial<NativeStackNavigationOptions>;
    items: ListViewCell[];
    itemsType: CollectionViewCellType;

    children?: React.ReactNode;
}

export default function ListPageView(props: ListPageViewProps): JSX.Element {
    const { menuOptions, navigationMenuOptions, items, itemsType, children } =
        props;

    let navigation = useNavigation<ListPageNavigationProp>();

    const [isOptionsDrawerVisible, setIsOptionsDrawerVisible] =
        useState<boolean>(false);

    const optionsText: string = `${itemsType} Options`;

    useEffect(() => {
        navigation.setOptions({
            ...navigationMenuOptions,
            headerRight: () => (
                <Button
                    title={optionsText}
                    onPress={() => setIsOptionsDrawerVisible(true)}
                />
            ),
        });
    }, [navigation, items]);

    const menuAction = (action: () => void): void => {
        // Close crawer
        setIsOptionsDrawerVisible(false);

        // Run the action
        action();
    };

    return (
        <>
            <CustomDrawer
                isVisible={isOptionsDrawerVisible}
                setIsVisible={setIsOptionsDrawerVisible}
                percentWidth={70}
            >
                <View
                    style={{
                        gap: 10,
                        padding: 10,
                        height: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ gap: 10 }}>
                        {menuOptions.map((mo, index) => (
                            <Button
                                disabled={mo.disabled}
                                title={mo.text}
                                onPress={() => menuAction(mo.onPress)}
                                testID={mo.testId}
                                color={mo.color}
                                key={index}
                            />
                        ))}
                    </View>
                    <View style={{ gap: 10 }}>
                        <Button
                            title="Import Data"
                            onPress={() =>
                                menuAction(() => navigation.navigate("Import"))
                            }
                        />
                        <Button
                            title="Export Data"
                            onPress={() =>
                                menuAction(() => navigation.navigate("Export"))
                            }
                        />
                        <Button
                            title="Settings"
                            onPress={() =>
                                menuAction(() =>
                                    navigation.navigate("Settings")
                                )
                            }
                        />
                        <Button
                            title="Close"
                            onPress={() => setIsOptionsDrawerVisible(false)}
                        />
                    </View>
                </View>
            </CustomDrawer>
            {children}
        </>
    );
}
