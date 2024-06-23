"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createData(response) {
    const result = response.data.result;
    let m = {}; // Initialize as an object with specified structure
    for (let i = 0; i < result.length; i++) {
        if (result[i].verdict === "OK") {
            const problemName = result[i].problem.name +
                result[i].problem.index +
                result[i].problem.contestId;
            m[problemName] = {
                tags: result[i].problem.tags,
                rating: result[i].problem.rating,
            };
        }
    }
    console.log(Object.keys(m).length);
    return m;
}
exports.default = createData;
