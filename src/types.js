"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsersGame = exports.stringifyUsersGame = exports.parseNonogram = exports.stringifyNonogram = void 0;
const stringifyNonogram = (nonogram) => {
    return {
        height: nonogram.height,
        width: nonogram.width,
        title: nonogram.title,
        colorMapping: nonogram.colorMapping,
        goal: JSON.stringify(nonogram.goal),
        rows: JSON.stringify(nonogram.rows),
        columns: JSON.stringify(nonogram.columns),
        difficulty: nonogram.difficulty
    };
};
exports.stringifyNonogram = stringifyNonogram;
const parseNonogram = (dbNonogram) => {
    return {
        height: dbNonogram.height,
        width: dbNonogram.width,
        title: dbNonogram.title,
        colorMapping: dbNonogram.colorMapping,
        goal: JSON.parse(dbNonogram.goal),
        rows: JSON.parse(dbNonogram.rows),
        columns: JSON.parse(dbNonogram.columns),
        difficulty: dbNonogram.difficulty
    };
};
exports.parseNonogram = parseNonogram;
const stringifyUsersGame = (usersGame) => {
    return {
        userId: usersGame.userId,
        nonogramId: usersGame.nonogramId,
        bestTime: usersGame.bestTime,
        state: usersGame.state,
        currentUserSolution: JSON.stringify(usersGame.currentUserSolution),
        currentTime: usersGame.currentTime,
        currentUserRows: JSON.stringify(usersGame.currentUserRows),
        currentUserColumns: JSON.stringify(usersGame.currentUserColumns),
    };
};
exports.stringifyUsersGame = stringifyUsersGame;
const parseUsersGame = (dbUsersGame) => {
    return {
        userId: dbUsersGame.userId,
        nonogramId: dbUsersGame.nonogramId,
        bestTime: dbUsersGame.bestTime,
        state: dbUsersGame.state,
        currentUserSolution: JSON.parse(dbUsersGame.currentUserSolution),
        currentTime: dbUsersGame.currentTime,
        currentUserRows: JSON.parse(dbUsersGame.currentUserRows),
        currentUserColumns: JSON.parse(dbUsersGame.currentUserColumns),
    };
};
exports.parseUsersGame = parseUsersGame;
