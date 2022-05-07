"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.MessageEventEmitter = void 0;
var events_1 = require("events");
var MessageEventEmitter = /** @class */ (function (_super) {
    __extends(MessageEventEmitter, _super);
    function MessageEventEmitter(connection) {
        var _this = _super.call(this) || this;
        var data = '';
        connection.on('data', function (chunk) {
            data += chunk;
        });
        connection.on('end', function () {
            var message = JSON.parse(data.toString());
            _this.emit('message', message);
        });
        return _this;
    }
    return MessageEventEmitter;
}(events_1.EventEmitter));
exports.MessageEventEmitter = MessageEventEmitter;
