# 鍙戝竷鎸囧崡

鏈枃妗ｈ鏄庡浣曞皢 `koishi-plugin-lsnet` 鍙戝竷鍒?npm 鍜?GitHub銆?
## 鍓嶇疆鍑嗗

### 1. npm 璐﹀彿

纭繚浣犳湁 npm 璐﹀彿锛屽鏋滄病鏈夎鍦?[npmjs.com](https://www.npmjs.com/) 娉ㄥ唽銆?
鐧诲綍 npm锛?
```bash
npm login
```

### 2. GitHub 浠撳簱

鍦?GitHub 涓婂垱寤轰粨搴?`koishi-plugin-lsnet`銆?
### 3. 鏇存柊閰嶇疆

鍦?`package.json` 涓洿鏂颁互涓嬪瓧娈碉細

```json
{
  "author": "浣犵殑鍚嶅瓧",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/浣犵殑鐢ㄦ埛鍚?koishi-plugin-lsnet.git"
  },
  "bugs": {
    "url": "https://github.com/浣犵殑鐢ㄦ埛鍚?koishi-plugin-lsnet/issues"
  },
  "homepage": "https://github.com/浣犵殑鐢ㄦ埛鍚?koishi-plugin-lsnet#readme"
}
```

鍚屾椂鏇存柊 `README.md` 涓殑鎵€鏈夐摼鎺ャ€?
## 鍙戝竷鍒?GitHub

### 1. 鍒濆鍖?Git 浠撳簱

```bash
git init
git add .
git commit -m "Initial commit: koishi-plugin-lsnet v1.0.0"
```

### 2. 娣诲姞杩滅▼浠撳簱

```bash
git remote add origin https://github.com/浣犵殑鐢ㄦ埛鍚?koishi-plugin-lsnet.git
git branch -M main
git push -u origin main
```

### 3. 鍒涘缓 Release

鍦?GitHub 涓婂垱寤轰竴涓柊鐨?Release锛?
1. 杩涘叆浠撳簱鐨?Releases 椤甸潰
2. 鐐瑰嚮 "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. 鎻忚堪鍙戝竷鍐呭锛堝彲浠ヤ粠 CHANGELOG.md 澶嶅埗锛?6. 鐐瑰嚮 "Publish release"

## 鍙戝竷鍒?npm

### 1. 楠岃瘉鍖呭唴瀹?
妫€鏌ュ皢瑕佸彂甯冪殑鏂囦欢锛?
```bash
npm pack --dry-run
```

纭繚鍖呭惈浠ヤ笅鏂囦欢锛?- `index.js`
- `src/index.ts`
- `README.md`
- `LICENSE`
- `package.json`

### 2. 鍙戝竷鍒?npm

```bash
npm publish
```

濡傛灉鏄涓€娆″彂甯冿紝鍙兘闇€瑕侀獙璇侀偖绠便€?
### 3. 楠岃瘉鍙戝竷

璁块棶 npm 鍖呴〉闈細

```
https://www.npmjs.com/package/koishi-plugin-lsnet
```

## 鍚庣画鐗堟湰鏇存柊

### 1. 鏇存柊鐗堟湰鍙?
鏍规嵁鍙樻洿绫诲瀷鏇存柊鐗堟湰鍙凤紙閬靛惊璇箟鍖栫増鏈級锛?
```bash
# 琛ヤ竵鐗堟湰 (bug 淇)
npm version patch

# 娆＄増鏈?(鏂板姛鑳斤紝鍚戝悗鍏煎)
npm version minor

# 涓荤増鏈?(鐮村潖鎬у彉鏇?
npm version major
```

### 2. 鏇存柊 CHANGELOG.md

鍦?`CHANGELOG.md` 涓褰曟柊鐗堟湰鐨勫彉鏇淬€?
### 3. 鎻愪氦骞舵帹閫?
```bash
git add .
git commit -m "Release vX.Y.Z"
git push
git push --tags
```

### 4. 鍙戝竷鍒?npm

```bash
npm publish
```

### 5. 鍦?GitHub 鍒涘缓鏂?Release

鍙傝€冧笂闈㈢殑姝ラ鍦?GitHub 鍒涘缓鏂扮殑 Release銆?
## 鏈€浣冲疄璺?
1. **娴嬭瘯鍚庡啀鍙戝竷**锛氱‘淇濆湪鏈湴鍜?example 鐩綍涓厖鍒嗘祴璇?2. **鐗堟湰鍙疯鑼?*锛氫弗鏍奸伒寰涔夊寲鐗堟湰瑙勮寖
3. **CHANGELOG**锛氭瘡娆″彂甯冮兘鏇存柊 CHANGELOG
4. **鏂囨。鍚屾**锛氱‘淇?README 鍜屼唬鐮佷繚鎸佸悓姝?5. **鏍囩绠＄悊**锛氫负姣忎釜鐗堟湰鍒涘缓 Git 鏍囩
6. **鎸佺画闆嗘垚**锛氳€冭檻娣诲姞 GitHub Actions 鑷姩鍖栨祴璇曞拰鍙戝竷

## 娴嬭瘯瀹夎

鍙戝竷鍚庯紝鍦ㄦ柊鐩綍涓祴璇曞畨瑁咃細

```bash
mkdir test-install
cd test-install
npm init -y
npm install koishi-plugin-lsnet
```

妫€鏌ユ彃浠舵槸鍚︽纭畨瑁呭拰鍙敤銆?
## 鏁呴殰鎺掗櫎

### npm 鍙戝竷澶辫触

- 妫€鏌ユ槸鍚﹀凡鐧诲綍锛歚npm whoami`
- 妫€鏌ュ寘鍚嶆槸鍚﹀凡琚崰鐢?- 纭 package.json 閰嶇疆姝ｇ‘

### GitHub 鎺ㄩ€佸け璐?
- 妫€鏌ヨ繙绋嬩粨搴?URL 鏄惁姝ｇ‘
- 纭鏈夋帹閫佹潈闄?- 灏濊瘯浣跨敤 SSH 鑰屼笉鏄?HTTPS

## 鐩稿叧閾炬帴

- [npm 鏂囨。](https://docs.npmjs.com/)
- [璇箟鍖栫増鏈琞(https://semver.org/lang/zh-CN/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

