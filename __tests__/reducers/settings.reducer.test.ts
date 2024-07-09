import { defaultSettingsData } from "../../contexts/settings.context";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
    settingsReducer,
} from "../../data/reducers/settings.reducer";

describe("Settings Reducer", () => {
    it("updates developer mode", () => {
        const { isDeveloperModeEnabled } = settingsReducer(
            defaultSettingsData,
            new UpdateDeveloperMode(true)
        );

        expect(isDeveloperModeEnabled).toEqual(true);
    });

    it("updates default list type", () => {
        const { defaultListType } = settingsReducer(
            defaultSettingsData,
            new UpdateDefaultListType("Ordered To-Do")
        );

        expect(defaultListType).toEqual("Ordered To-Do");
    });

    it("updates default new list position", () => {
        const { defaultListPosition } = settingsReducer(
            defaultSettingsData,
            new UpdateDefaultListPosition("top")
        );

        expect(defaultListPosition).toEqual("top");
    });
});
