# rebix-emoji

## functions

convertEmojiCharToShortCode;
//转换单个    :smile: ===> smile


convertShortCodeToEmojiChar;
//转换单个    smile ===> :smile:


convertShortCodeToEmojiHTML;
//转换单个    smile ===> `<img class='rebix-emoji'/>`


replaceEmojiCharToShortCode;
//转换字符串  hello :smile: world ===> hello `:smile:` world


replaceShortCodeToEmojiHTML;
//转换字符串  hello `:smile:` world ===> hello `<div class="rebix-emoji"></div>` world


## DataSource

emojiGroup

`

    "People": [
        "smile",
        "laughing",
        "blush",
        ...
    ],
    "Nature": [
        "sunny",
        "umbrella",
        "umbrella_with_rain_drops",
        "cloud",
        ...
    ],
    "Objects": [
        "bamboo",
        "gift_heart",
        "dolls",
        "school_satchel",
        ...
    ],
    "Places": [
        "house",
        "house_with_garden",
        "school",
        "office",
        ...
    ],
    "Symbols": [
        "one",
        "two",
        "three",
        ...
    ]
`
