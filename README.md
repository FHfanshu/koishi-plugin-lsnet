# koishi-plugin-lsnet

[![npm](https://img.shields.io/npm/v/koishi-plugin-lsnet?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-lsnet)
[![License](https://img.shields.io/github/license/FHfanshu/koishi-plugin-lsnet?style=flat-square)](https://github.com/FHfanshu/koishi-plugin-lsnet/blob/main/LICENSE)

Koishi 鎻掍欢锛岄€氳繃璋冪敤鏈湴 ComfyUI LSNet API 鏉ヨ瘑鍒浘鐗囩殑鐢诲笀椋庢牸銆?
## 鍔熻兘鐗规€?
- 馃帹 **鐢诲笀椋庢牸璇嗗埆**锛氫娇鐢?[Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) 妯″瀷杩涜鍥剧墖鐢诲笀椋庢牸鎺ㄧ悊
- 馃摫 **OneBot 鍗忚鏀寔**锛氬畬缇庢敮鎸?OneBot 鍗忚鐨勮亰澶╁钩鍙?- 鈿欙笍 **鐏垫椿閰嶇疆**锛氭敮鎸佽嚜瀹氫箟 API 绔偣銆佹ā鍨嬪弬鏁扮瓑
- 馃殌 **楂樻€ц兘**锛氬埄鐢ㄦ湰鍦?ComfyUI 鏈嶅姟锛屽揩閫熷搷搴?
## 鍓嶇疆瑕佹眰

1. **ComfyUI LSNet 鎻掍欢**锛氶渶瑕佸湪鏈湴瀹夎骞惰繍琛?[comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet)
2. **Kaloscope 妯″瀷**锛氫笅杞?[Kaloscope 2.0 妯″瀷](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 骞舵斁缃埌 ComfyUI 鐨勬ā鍨嬬洰褰?3. **Koishi 鐜**锛欿oishi v4.14.0 鎴栨洿楂樼増鏈?4. **Node.js**锛歂ode.js 18 鎴栨洿楂樼増鏈?
## 瀹夎

### 浣跨敤 npm

```bash
npm install koishi-plugin-lsnet
```

### 浣跨敤 yarn

```bash
yarn add koishi-plugin-lsnet
```

## 閰嶇疆

鍦?Koishi 閰嶇疆鏂囦欢涓坊鍔犳彃浠讹細

```yaml
plugins:
  lsnet:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer  # ComfyUI LSNet API 鍦板潃
    modelName: Kaloscope                             # 妯″瀷鐩綍鍚嶇О
    device: cuda                                     # 璁惧绫诲瀷: cuda 鎴?cpu
    topK: 5                                          # 杩斿洖鍓?K 涓粨鏋?    threshold: 0                                     # 缃俊搴﹂槇鍊?(0-1)
    trigger: lsnet                                   # 瑙﹀彂鎸囦护鍏抽敭瀛?```

### 閰嶇疆椤硅鏄?
| 閰嶇疆椤?| 绫诲瀷 | 榛樿鍊?| 璇存槑 |
|--------|------|--------|------|
| `endpoint` | string | 蹇呭～ | ComfyUI LSNet API 鐨勫畬鏁村湴鍧€ |
| `modelName` | string | `Kaloscope` | LSNet 妯″瀷鐩綍鍚嶇О |
| `device` | `cuda` \| `cpu` | `cuda` | 鎺ㄧ悊浣跨敤鐨勮澶?|
| `topK` | number | `5` | 杩斿洖鍓?K 涓瘑鍒粨鏋滐紙1-20锛?|
| `threshold` | number | `0` | 鏈€浣庣疆淇″害闃堝€硷紙0-1锛?|
| `trigger` | string | `lsnet` | 瑙﹀彂璇嗗埆鐨勬寚浠ゅ叧閿瓧 |

## 浣跨敤鏂规硶

1. 纭繚 ComfyUI 鍜?LSNet 鎻掍欢宸插惎鍔?2. 鍦ㄨ亰澶╁钩鍙板彂閫佽Е鍙戞寚浠わ紙榛樿涓?`lsnet`锛? 鍥剧墖
3. 鏈哄櫒浜哄皢杩斿洖璇嗗埆鍒扮殑鐢诲笀鍚嶇О鍜岀疆淇″害

### 绀轰緥

```
鐢ㄦ埛: lsnet [鍥剧墖]
鏈哄櫒浜? 璇嗗埆缁撴灉锛歁ika Pikazo锛堢疆淇″害 87.65%锛?```

## ComfyUI LSNet 璁剧疆

### 瀹夎 ComfyUI LSNet

鍙傝€?[comfyui-lsnet 浠撳簱](https://github.com/spawner1145/comfyui-lsnet) 鐨勫畨瑁呰鏄庛€?
### 涓嬭浇妯″瀷

浠?[Hugging Face](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 涓嬭浇 Kaloscope 2.0 妯″瀷鏂囦欢锛屽苟鏀剧疆鍒帮細

```
ComfyUI/models/lsnet/Kaloscope/
```

### 鍚姩 API 鏈嶅姟

```bash
# 鍚姩 ComfyUI LSNet API
python -m scripts.app
```

榛樿鐩戝惉鍦?`http://127.0.0.1:7860`

## API 鏍煎紡

鎻掍欢浼氬悜 ComfyUI LSNet API 鍙戦€佸涓嬫牸寮忕殑璇锋眰锛?
```json
{
  "input_image": "base64_encoded_image_data",
  "model_name": "Kaloscope",
  "device": "cuda",
  "top_k": 5,
  "threshold": 0.0
}
```

棰勬湡杩斿洖鏍煎紡锛?
```json
{
  "results": {
    "classification": [
      {
        "class_name": "Artist Name",
        "probability": 0.8765
      }
    ]
  }
}
```

## 寮€鍙?
### 鍏嬮殕浠撳簱

```bash
git clone https://github.com/FHfanshu/koishi-plugin-lsnet.git
cd koishi-plugin-lsnet
```

### 瀹夎渚濊禆

```bash
npm install
```

### 鏋勫缓

```bash
npm run build
```

### 娴嬭瘯

鍦?`example/` 鐩綍涓嬫彁渚涗簡涓€涓祴璇曠敤鐨?Koishi 瀹炰緥锛?
```bash
cd example
npm install
npm start
```

## 鏁呴殰鎺掗櫎

### 鍥剧墖鑾峰彇澶辫触

濡傛灉閬囧埌鍥剧墖鑾峰彇澶辫触鐨勯棶棰橈紝鎻掍欢浼氬皾璇曞绉嶆柟寮忚幏鍙栧浘鐗囷細
1. 鐩存帴浠?URL 涓嬭浇
2. 閫氳繃 Bot 鐨?`getFile` API 鑾峰彇
3. 浣跨敤鏈湴鏂囦欢璺緞

### API 璋冪敤瓒呮椂

榛樿瓒呮椂鏃堕棿涓?60 绉掋€傚鏋滄ā鍨嬫帹鐞嗘椂闂磋緝闀匡紝鍙兘闇€瑕侊細
- 浣跨敤鏇村己鐨?GPU
- 鍑忓皬 `topK` 鍙傛暟
- 浼樺寲 ComfyUI 閰嶇疆

### OneBot 鍗忚鍏煎鎬?
鐩墠浠呮敮鎸?OneBot 鍗忚銆傚闇€鏀寔鍏朵粬鍗忚锛岃鎻愪氦 Issue 鎴?PR銆?
## 鑷磋阿

- [comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet) - ComfyUI LSNet 鎻掍欢
- [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) - 鐢诲笀椋庢牸璇嗗埆妯″瀷
- [@heathcliff01](https://huggingface.co/heathcliff01) - 妯″瀷璁粌

## 璁稿彲璇?
鏈」鐩噰鐢?[MIT](LICENSE) 璁稿彲璇併€?
## 璐＄尞

娆㈣繋鎻愪氦 Issue 鍜?Pull Request锛?
## 閾炬帴

- [GitHub 浠撳簱](https://github.com/FHfanshu/koishi-plugin-lsnet)
- [npm 鍖匽(https://www.npmjs.com/package/koishi-plugin-lsnet)
- [Koishi 瀹樼綉](https://koishi.chat/)

