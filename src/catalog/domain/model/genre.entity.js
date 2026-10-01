/**
 * @class Genre
 * @summary Represents a genre entity in the Catalog bounded context.
 */

export class Genre{

    /**
     * @param {Object} params - the genre parameters.
     * @param {number | null} params.id - The genre ID.
     * @param {string} params.name - The genre name.
     * @param {string} params.description - The genre description.
     */

    constructor({id = null, name = '', description = ''}) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}