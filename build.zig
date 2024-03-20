const std = @import("std");

pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "server",
        .root_source_file = .{ .path = "./src/main.zig" },
        .target = b.standardTargetOptions(.{}),
    });

    const websocket_lib = b.addModule("websocket", .{
        .source_file = .{ .path="./libs/websocket.zig/src/websocket.zig"}
    });

    exe.addModule("websocket", websocket_lib);

    b.installArtifact(exe);

    const run_exe = b.addRunArtifact(exe);

    const run_step = b.step("run", "Run the application");
    run_step.dependOn(&run_exe.step);
}