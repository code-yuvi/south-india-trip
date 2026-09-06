import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


QUERIES = {
    "pune": "Pune Shaniwar Wada",
    "srisailam": "Srisailam Mallikarjuna Temple",
    "tirupati": "Tirumala Venkateswara Temple",
    "madurai": "Meenakshi Amman Temple Madurai",
    "rameswaram": "Ramanathaswamy Temple corridor",
    "dhanushkodi": "Dhanushkodi church ruins",
    "kanyakumari": "Vivekananda Rock Memorial Kanyakumari sunrise",
    "tvm": "Padmanabhaswamy Temple Thiruvananthapuram",
    "jatayu": "Jatayu Earth's Center Kerala sculpture",
    "kolli": "Kolli Hills hairpin road",
    "adiyogi": "Adiyogi Shiva statue Coimbatore",
    "ooty": "Ooty tea plantations Nilgiri",
    "mysore": "Mysore Palace illuminated",
    "kolhapur": "Mahalakshmi Temple Kolhapur",
}

API = "https://commons.wikimedia.org/w/api.php"
UA = "SouthIndiaTripPage/1.0 (personal travel planner; contact via GitHub code-yuvi)"
ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_photo_candidates"


def api(params):
    params["format"] = "json"
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def search(query, limit=8):
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query + " filetype:bitmap",
            "gsrnamespace": 6,
            "gsrlimit": limit,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size",
            "iiurlwidth": 480,
        }
    )
    pages = list(data.get("query", {}).get("pages", {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    return pages


def clean(value):
    text = value or ""
    for token in ("<br>", "<br/>", "<br />"):
        text = text.replace(token, " ")
    while "<" in text and ">" in text:
        left = text.find("<")
        right = text.find(">", left)
        if right < 0:
            break
        text = text[:left] + text[right + 1 :]
    return " ".join(text.split())


def main():
    OUT.mkdir(exist_ok=True)
    manifest = {}
    for key, query in QUERIES.items():
        folder = OUT / key
        folder.mkdir(exist_ok=True)
        manifest[key] = []
        print("Searching", key, "-", query)
        for index, page in enumerate(search(query), start=1):
            info = page.get("imageinfo", [{}])[0]
            thumb = info.get("thumburl") or info.get("url")
            if not thumb:
                continue
            ext = info.get("extmetadata", {})
            record = {
                "candidate": index,
                "title": page.get("title", ""),
                "page": info.get("descriptionurl", ""),
                "url": info.get("url", ""),
                "thumb": thumb,
                "artist": clean(ext.get("Artist", {}).get("value", "")),
                "license": clean(
                    ext.get("LicenseShortName", {}).get("value", "")
                ),
                "license_url": ext.get("LicenseUrl", {}).get("value", ""),
                "credit": clean(ext.get("Credit", {}).get("value", "")),
                "width": info.get("width"),
                "height": info.get("height"),
            }
            manifest[key].append(record)
            target = folder / f"{index}.jpg"
            try:
                req = urllib.request.Request(thumb, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=30) as response:
                    target.write_bytes(response.read())
                with Image.open(target) as im:
                    im.convert("RGB").save(target, "JPEG", quality=85)
            except Exception as error:
                print("  failed", index, error)
    (OUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    make_sheet(manifest)


def make_sheet(manifest):
    cell_w, cell_h = 250, 180
    keys = list(QUERIES)
    sheet = Image.new("RGB", (cell_w * 4, cell_h * len(keys)), "#08080b")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for row, key in enumerate(keys):
        for col in range(4):
            path = OUT / key / f"{col + 1}.jpg"
            x, y = col * cell_w, row * cell_h
            if path.exists():
                with Image.open(path) as im:
                    im = im.convert("RGB")
                    scale = max(cell_w / im.width, 145 / im.height)
                    size = (round(im.width * scale), round(im.height * scale))
                    im = im.resize(size, Image.Resampling.LANCZOS)
                    left = (im.width - cell_w) // 2
                    top = (im.height - 145) // 2
                    sheet.paste(im.crop((left, top, left + cell_w, top + 145)), (x, y))
            draw.rectangle((x, y + 145, x + cell_w, y + cell_h), fill="#15151b")
            record = manifest[key][col] if col < len(manifest[key]) else {}
            title = record.get("title", "")
            draw.text((x + 7, y + 150), f"{key} #{col + 1}", fill="#ffffff", font=font)
            draw.text((x + 7, y + 164), title[:38], fill="#aaaaaf", font=font)
    sheet.save(OUT / "contact-sheet.jpg", "JPEG", quality=90)


if __name__ == "__main__":
    main()
