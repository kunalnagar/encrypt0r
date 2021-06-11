"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinationStream = exports.getSourceStream = void 0;
var fs_1 = require("fs");
var getSourceStream = function (path, start, end) {
    return fs_1.createReadStream(path, {
        start: start,
        end: end,
    });
};
exports.getSourceStream = getSourceStream;
var getDestinationStream = function (path) {
    return fs_1.createWriteStream(path);
};
exports.getDestinationStream = getDestinationStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1c2luZXNzLWxvZ2ljL2hlbHBlcnMvc3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUtZO0FBRUwsSUFBTSxlQUFlLEdBQUcsVUFDN0IsSUFBWSxFQUNaLEtBQWMsRUFDZCxHQUFZO0lBRVosT0FBTyxxQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7UUFDNUIsS0FBSyxPQUFBO1FBQ0wsR0FBRyxLQUFBO0tBQ0osQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBVFcsUUFBQSxlQUFlLG1CQVMxQjtBQUVLLElBQU0sb0JBQW9CLEdBQUcsVUFBQyxJQUFZO0lBQy9DLE9BQU8sc0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQyxDQUFDO0FBRlcsUUFBQSxvQkFBb0Isd0JBRS9CIn0=