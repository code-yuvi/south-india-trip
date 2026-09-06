import base64
import html
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
PAGE = ROOT / "south-india-trip-plan.html"
MANIFEST = ROOT / "_photo_candidates" / "manifest.json"
OUT = ROOT / "_embedded_photos"
API = "https://commons.wikimedia.org/w/api.php"
UA = "SouthIndiaTripPage/1.0 (personal travel planner; GitHub code-yuvi)"

PICKS = {
    "pune": 1,
    "srisailam": 1,
    "tirupati": 2,
    "madurai": 1,
    "rameswaram": 2,
    "dhanushkodi": 1,
    "kanyakumari": 2,
    "tvm": 1,
    "jatayu": 3,
    "kolli": 1,
    "adiyogi": 2,
    "ooty": 3,
    "mysore": 1,
    "kolhapur": 2,
}

# Crop focal points, expressed as Pillow centering coordinates.
FOCUS = {
    "pune": (0.5, 0.48),
    "srisailam": (0.5, 0.52),
    "tirupati": (0.5, 0.44),
    "madurai": (0.5, 0.45),
    "rameswaram": (0.5, 0.43),
    "dhanushkodi": (0.5, 0.46),
    "kanyakumari": (0.5, 0.48),
    "tvm": (0.5, 0.48),
    "jatayu": (0.5, 0.47),
    "kolli": (0.5, 0.5),
    "adiyogi": (0.5, 0.5),
    "ooty": (0.5, 0.48),
    "mysore": (0.5, 0.5),
    "kolhapur": (0.5, 0.42),
}

NAMES = {
    "pune": "Pune",
    "srisailam": "Srisailam",
    "tirupati": "Tirupati",
    "madurai": "Madurai",
    "rameswaram": "Rameswaram",
    "dhanushkodi": "Dhanushkodi",
    "kanyakumari": "Kanyakumari",
    "tvm": "Thiruvananthapuram",
    "jatayu": "Jatayu",
    "kolli": "Kolli Hills",
    "adiyogi": "Adiyogi",
    "ooty": "Ooty",
    "mysore": "Mysore",
    "kolhapur": "Kolhapur",
}


def query_thumb(title):
    params = {
        "action": "query",
        "format": "json",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": 1200,
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                data = json.load(response)
            break
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(8 * (attempt + 1))
    page = next(iter(data["query"]["pages"].values()))
    return page["imageinfo"][0].get("thumburl") or page["imageinfo"][0]["url"]


def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read()


def make_photo(raw, key):
    with Image.open(BytesIO(raw)) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        photo = ImageOps.fit(
            source,
            (900, 506),
            method=Image.Resampling.LANCZOS,
            centering=FOCUS[key],
        )
        out = BytesIO()
        photo.save(out, "WEBP", quality=72, method=6)
        return out.getvalue()


def clean_artist(value):
    # Candidate sourcing already removed HTML tags; decode any remaining entities.
    value = html.unescape(value or "").strip()
    return value if value and value.lower() != "own work" else "Wikimedia Commons contributor"


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    photos = {}

    for key, index in PICKS.items():
        record = manifest[key][index - 1]
        print("Embedding", key, "-", record["title"])
        target = OUT / f"{key}.webp"
        if target.exists():
            encoded = target.read_bytes()
        else:
            url = query_thumb(record["title"])
            encoded = make_photo(download(url), key)
            target.write_bytes(encoded)
            time.sleep(2)
        photos[key] = {
            "name": NAMES[key],
            "src": "data:image/webp;base64,"
            + base64.b64encode(encoded).decode("ascii"),
            "title": record["title"].removeprefix("File:"),
            "artist": clean_artist(record["artist"]),
            "license": record["license"] or "Wikimedia Commons",
            "page": record["page"],
            "licenseUrl": record["license_url"],
        }

    js = (
        "/* Embedded, compressed Wikimedia Commons photographs. */\n"
        "var PHOTOS="
        + json.dumps(photos, ensure_ascii=True, separators=(",", ":"))
        + ";\n"
    )
    text = PAGE.read_text(encoding="utf-8")
    start = "/* Embedded, compressed Wikimedia Commons photographs. */"
    marker = "var ART_UID=0;"
    if start in text:
        before, rest = text.split(start, 1)
        _, after = rest.split(marker, 1)
        text = before + js + marker + after
    else:
        text = text.replace(marker, js + marker, 1)
    PAGE.write_text(text, encoding="utf-8")
    total = sum((OUT / f"{key}.webp").stat().st_size for key in PICKS)
    print(f"Embedded {len(PICKS)} photos, {total / 1024:.0f} KiB total")


if __name__ == "__main__":
    main()
