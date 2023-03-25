deno compile --allow-read --allow-write --allow-net=cargo.io --target x86_64-pc-windows-msvc --output .\target\windows_x64\opencredit.exe .\src\index.ts
deno compile --allow-read --allow-write --allow-net=cargo.io --target x86_64-unknown-linux-gnu --output .\target\linux_x64\opencredit .\src\index.ts
deno compile --allow-read --allow-write --allow-net=cargo.io --target x86_64-apple-darwin --output .\target\apple_x64\opencredit .\src\index.ts
deno compile --allow-read --allow-write --allow-net=cargo.io --target aarch64-apple-darwin --output .\target\apple_aarch64\opencredit .\src\index.ts