import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ListWithSections, Section, Item } from "../data/data";
import { ReactNode, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

interface SectionedListProps {}

export default function SectionedList(props: SectionedListProps) {
    const sections: Section[] = [
        new Section("Produce", [
            new Item("Carrots", 1, "Item", false),
            new Item("Celery", 1, "Item", false),
        ]),
        new Section("Candy", [
            new Item("Twizzlers", 1, "Item", false),
            new Item("Jelly Beans", 1, "Item", false),
            new Item("Gummy Sharks", 1, "Item", false),
        ]),
    ];

    const listData: ListWithSections = new ListWithSections(
        "My List",
        sections
    );

    const [list, setList] = useState<ListWithSections>(listData);

    const renderItem = (params: RenderItemParams<Item>): ReactNode => {
        const { item, getIndex, drag, isActive } = params;

        return (
            <ScaleDecorator>
                <Pressable
                    disabled={isActive}
                    onLongPress={drag}
                    onPress={() => console.log(item.name)}
                    style={{
                        backgroundColor: isActive ? "lightblue" : "white",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                        }}
                    >
                        {item.name}
                    </Text>
                </Pressable>
            </ScaleDecorator>
        );
    };

    const updateLists = (items: Item[], index: number) => {
        const newList: ListWithSections = new ListWithSections(
            list.name,
            list.sections.map((section, i) =>
                i === index ? new Section(section.name, items) : section
            )
        );
        setList(newList);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NestableScrollContainer>
                {list.sections.map((section, index) => (
                    <View key={`${section.name}-${index}`}>
                        <Text style={{ fontSize: 30 }}>{section.name}</Text>
                        <NestableDraggableFlatList
                            data={section.items}
                            keyExtractor={function (
                                item: Item,
                                index: number
                            ): string {
                                return `${item.name}-${index}`;
                            }}
                            renderItem={renderItem}
                            onDragEnd={({ data }) => updateLists(data, index)}
                        />
                    </View>
                ))}
            </NestableScrollContainer>
        </GestureHandlerRootView>
    );
}
