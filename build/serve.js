"use strict"

const send = require("koa-send");

module.exports = function serve(path, opt) {
    // remove / begin
	const root = opt.root
    path = path.replace(/^\/+/, "");
	let isFileFlag = true
    return function(ctx, next) {
        if(ctx.method == "HEAD" || ctx.method == "GET") {

            let req_path_array = ctx.path.slice(1).split("/");
            // match path
            if(path.length == 0 || path == req_path_array[0]) {
                // if not serve the root
                // then remove the filtered folder from path
                if(path.length != 0 && req_path_array.length > 1) {
                    req_path_array = req_path_array.slice(1);
                } else if (req_path_array.length === 1 && isFileFlag) {
					opt.root = opt.root.slice(0, -(req_path_array[0].length + 1))
					isFileFlag = false
				}
                return send(ctx, req_path_array.join("/") || "/", opt.root);
            }
        }

        return next();
    }
};