import { Item, List, Section, Settings } from "./data";
import { ItemJSON, ListJSON, SectionJSON, SettingsJSON } from "./utils";

// Lists
export function listsToJSON(lists: List[]): ListJSON[] {
    return lists.map((list) => listToJSON(list));
}

export function listToJSON(list: List): ListJSON {
    return {
        id: list.id,
        name: list.name,
        type: list.listType,
        defaultNewItemPosition: list.defaultNewItemPosition,
        isSelected: list.isSelected,
        sections: sectionsToJSON(list.sections)
    };
}

export function jsonListsToObject(listsJSON: ListJSON[]): List[] {
    // "list.type" is a legacy property. DO NOT CHANGE!
    return listsJSON.map((list) =>
        new List(
            list.id,
            list.name,
            list.type || "List",
            list.defaultNewItemPosition || "bottom",
            jsonSectionsToObject(list.sections),
            list.isSelected
        )
    );
}

export function jsonSectionsToObject(sectionsJSON: SectionJSON[]): Section[] {
    return sectionsJSON.map(section => new Section(section.name, jsonItemsToObject(section.items)));
}

// Sections
export function sectionsToJSON(sections: Section[]): SectionJSON[] {
    return sections.map(section => sectionToJSON(section));
}

export function sectionToJSON(section: Section): SectionJSON {
    return {
        name: section.name,
        items: itemsToJSON(section.items)
    }
}

// Items
export function itemsToJSON(items: Item[]): ItemJSON[] {
    return items.map((item) => itemToJSON(item));
}

export function itemToJSON(item: Item): ItemJSON {
    // "value" is a legacy property. DO NOT CHANGE!
    return {
        value: item.name,
        quantity: item.quantity,
        isComplete: item.isComplete,
        isSelected: item.isSelected,
        itemType: item.itemType
    };
}

export function jsonItemsToObject(itemsJSON: ItemJSON[]): Item[] {
    return itemsJSON.map((item) =>
        new Item(item.value, item.quantity, item.itemType ?? "Item", item.isComplete, item.isSelected)
    );
}

// Settings
export function settingsToJSON(settings: Settings): SettingsJSON {
    return {
        isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
        defaultListPosition: settings.defaultListPosition,
        defaultListType: settings.defaultListType
    };
}

export function jsonSettingsToObject(settingsJSON: SettingsJSON, updateSettings: (settings: Settings) => void): Settings {
    return {
        isDeveloperModeEnabled: settingsJSON.isDeveloperModeEnabled,
        defaultListPosition: settingsJSON.defaultListPosition,
        defaultListType: settingsJSON.defaultListType,
        updateSettings: updateSettings
    }
}