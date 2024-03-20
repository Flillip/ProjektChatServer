const std = @import("std");
const info = std.log.info;

pub fn main() !void {
    info("hello world!", .{});
}