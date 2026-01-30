import { openDB } from 'idb';

const DB_NAME = 'ForgeUI_Library';
const STORE_NAME = 'components';

class LibraryService {
    constructor() {
        this._dbPromise = null;
    }

    async _initDB() {
        if (!this._dbPromise) {
            this._dbPromise = openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                },
            });
        }
        return this._dbPromise;
    }

    /**
     * Saves or updates a component in the library.
     * @param {Object} componentData 
     * @returns {Promise<void>}
     */
    async saveComponent(componentData) {
        try {
            const db = await this._initDB();
            await db.put(STORE_NAME, componentData);
        } catch (error) {
            console.error("LibraryService: Error saving component", error);
            throw new Error("Failed to save component to library.");
        }
    }

    /**
     * Retrieves all components from the library.
     * @returns {Promise<Array>}
     */
    async getAllComponents() {
        try {
            const db = await this._initDB();
            return await db.getAll(STORE_NAME);
        } catch (error) {
            console.error("LibraryService: Error fetching components", error);
            throw new Error("Failed to load components.");
        }
    }

    /**
     * Retrieves a single component by ID.
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    async getComponentById(id) {
        try {
            const db = await this._initDB();
            return await db.get(STORE_NAME, id);
        } catch (error) {
            console.error(`LibraryService: Error fetching component ${id}`, error);
            throw new Error("Failed to retrieve component.");
        }
    }

    /**
     * Deletes a component by ID.
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async deleteComponent(id) {
        try {
            const db = await this._initDB();
            await db.delete(STORE_NAME, id);
        } catch (error) {
            console.error(`LibraryService: Error deleting component ${id}`, error);
            throw new Error("Failed to delete component.");
        }
    }

    /**
     * Helper to generate a unique ID.
     * @param {string} name 
     * @returns {string}
     */
    generateId(name) {
        return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    }

    /**
     * Checks if a folder name is already taken.
     * @param {string} folderName 
     * @returns {Promise<boolean>}
     */
    async isFolderNameTaken(folderName) {
        try {
            const components = await this.getAllComponents();
            return components.some(c => c.folderName === folderName);
        } catch (error) {
            console.warn("LibraryService: Error checking folder name, assuming false", error);
            return false;
        }
    }
}

export const libraryService = new LibraryService();
