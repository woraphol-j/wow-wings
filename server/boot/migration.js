'use strict';

function migrateTables(server) {
    const storage = server.datasources.db;
    storage.autoupdate();
}

module.exports = migrateTables;