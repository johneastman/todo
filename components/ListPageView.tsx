import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { ListPageNavigationProp } from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomDrawer from "./CustomDrawer";
import { Button, View } from "react-native";
import { MenuOption } from "../data/data";

interface ListPageViewProps<T> {
    optionsText: string;
    menuOptions: MenuOption[];
    navigationMenuOptions?: Partial<NativeStackNavigationOptions>;
    items: T[];

    children?: React.ReactNode;
}

export default function ListPageView<T>(
    props: ListPageViewProps<T>
): JSX.Element {
    const { optionsText, menuOptions, navigationMenuOptions, items, children } =
        props;

    let navigation = useNavigation<ListPageNavigationProp>();

    const [isOptionsDrawerVisible, setIsOptionsDrawerVisible] =
        useState<boolean>(false);

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
                                onPress={() => {
                                    mo.onPress();
                                    setIsOptionsDrawerVisible(false);
                                }}
                                testID={mo.testId}
                                color={mo.color}
                                key={index}
                            />
                        ))}
                    </View>
                    <View>
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
