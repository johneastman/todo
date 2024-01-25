import { defaultSettings } from "../../contexts/app.context";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
    appReducer,
} from "../../data/reducers/app.reducer";
import { AppData } from "../../types";

describe("Settings Reducer", () => {
    const oldState: AppData = {
        settings: defaultSettings,
        lists: [],
        itemsState: {
            currentIndex: -1,
            isModalVisible: false,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
        listsState: {
            currentIndex: -1,
            isModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    it("updates developer mode", () => {
        const {
            settings: { isDeveloperModeEnabled },
        } = appReducer(oldState, new UpdateDeveloperMode(true));

        expect(isDeveloperModeEnabled).toEqual(true);
    });

    it("updates default list type", () => {
        const {
            settings: { defaultListType },
        } = appReducer(oldState, new UpdateDefaultListType("Ordered To-Do"));

        expect(defaultListType).toEqual("Ordered To-Do");
    });

    it("updates default new list position", () => {
        const {
            settings: { defaultListPosition },
        } = appReducer(oldState, new UpdateDefaultListPosition("top"));

        expect(defaultListPosition).toEqual("top");
    });
});
