const { Permissions, Role, PermissionFlagsBits } = require('discord.js');
const { ownerID } = require('../../config.json');

module.exports = {
    /**
     * 
     * @param {string|Number|Role} role
     * @returns {Function}
     */
    checkHasRole: (role) => {
        return (member) => true ? member.roles.cache.find(r => r.name == role || r.id == role || r === role) : false;
    },
    /**
     * 
     * @param {Permissions} permissions 
     * @returns {Function}
     */
    checkHasPermissions: (permissions) => {
        return (member) => member.permissions.any(permissions);
    },
    /**
     * 
     * @param {string|Number} role
     * @returns {Function}
     */
    checkId: (id) => {
        return (member) => member.id == id;
    },
    /**
     * 
     * @returns {Function}
     */
    checkIsAdministrator: () => {
        return (member) => member.permissions.has([ PermissionFlagsBits.Administrator ]);
    },
    /**
     * 
     * @returns {Function}
     */
    checkIsOwner: () => {
        return (member) => member.id == ownerID;
    }
}
