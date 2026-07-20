import os
import pathlib
import zipfile

src = pathlib.Path(r"C:\Users\Asus\OneDrive\Desktop\zidio2")
dst = pathlib.Path(r"C:\Users\Asus\OneDrive\Desktop\zidio2-project.zip")
excluded = {".git", ".next", "node_modules", "__pycache__"}

if dst.exists():
    dst.unlink()

with zipfile.ZipFile(dst, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in excluded]
        for file in files:
            path = pathlib.Path(root) / file
            if path.name.lower().endswith(".tmp"):
                continue
            arcname = path.relative_to(src)
            zf.write(path, arcname.as_posix())

print(dst.exists(), dst.stat().st_size if dst.exists() else 0)
