"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayDateToDate = void 0;
function dayDateToDate(dayDate) {
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}
exports.dayDateToDate = dayDateToDate;
