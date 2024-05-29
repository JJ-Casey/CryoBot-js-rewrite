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
    checkIsAdministrator: (memberInput) => {
        if (memberInput) {
            return memberInput.permissions.has([ PermissionFlagsBits.Administrator ]);
        }
        return (member) => member.permissions.has([ PermissionFlagsBits.Administrator ]);
    },
    /**
     * 
     * @returns {Function}
     */
    checkIsOwner: (memberInput) => {
        if (memberInput) {
            return memberInput.id == ownerID;
        }
        return (member) => member.id == ownerID;
    }
}
