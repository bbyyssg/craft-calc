# Craft Calc（西语/葡语手工计算器站）

西班牙语为主（`/es/`）、巴西葡语为辅（`/pt/`）的纯静态计算器站，结构参照 `../uae-toolbox`：Astro 7.4.1，所有计算都在浏览器里完成，`src/site.ts` 集中管理配置，用 `node --test` 做单元测试。

## 一、调研结论（2026-10-21，用 WebSearch 在西语和葡语里搜索）

| 工具 | 西语搜索结果 | 葡语（巴西）搜索结果 | 竞争 | 是否做 |
|---|---|---|---|---|
| **钩针圆形每圈加针**（círculo de ganchillo / crochê） | 全是教程（Patronarte、facilisimo、Melonchillo），**没有专门的计算器**；仅 GitHub teje-con-medida 顺带涉及 | 全是教程（Natalia Salgado、Katia Ribeiro），Meu Novelo 也没有圆形工具 | **最弱** | ✅ |
| **针织均匀加减针**（aumentos repartidos） | 只有 GitHub teje-con-medida 一个工具，其余是 KnitPro 等文章 | 绝大多数是 Blogspot 教程，只有 Meu Novelo 的 13 个工具里有一个 | **很弱** | ✅ |
| **织物密度/样片换算**（muestra / amostra） | jjlmoya.es、crocheteningles、ctejidas、puntoylana 4～5 个 | calculadora.tricoetal、Meu Novelo、Escola de Artes Manuais | 中等 | ✅（与前两个工具互相内链，补足站点体量） |
| **蜡烛香精比例**（velas fragancia / essência） | naturcera、lamanualeria、iscalculator 3 个，多数结果是商家博客 | jornadadosaromas、aromavivohome、mileumavelas | 中等偏弱，且商业意图（卖材料）强，广告价值较高 | ✅ |
| 毛线用量（cuánta lana / quantos novelos） | puntoylana、ctejidas、toolszone、lutepy、ovillova 等 5 个以上 | meunovelo、gamebob、escoladeartesmanuais 等 | 较强 | ❌ |
| 手工皂碱量 SAP（calculadora jabón / sabão） | soapcalc 有翻译版，另有 frescoco、soapcalculator.app、miniwebtool、calcuworld、bio-esencia 等 | frescoco/pt、formuladesabaoartesanal、soapcalculator.net、aromasquecuram 等 | **最强** | ❌ |

最终选了 4 个工具：均匀加减针、钩针圆形、样片换算、蜡烛香精。
**手工皂 SAP 没有做**：一是竞争最激烈（多个有 150 种以上油脂数据库的成熟工具，还有 soapcalc 的翻译版）；二是碱量算错会导致化学灼伤，责任风险高。如果以后要做，SAP 值必须逐项引用公认来源（例如 SoapCalc 的油脂数据表或 Kevin Dunn 的 *Scientific Soapmaking*），并且要有逐项单元测试。

主要来源：KnitPro、Tricotando Crochê、Patronarte、Melonchillo、Natalia Salgado、Meu Novelo、GitHub elvaropablo-oss/teje-con-medida、Lana Grossa（filati.es）、calculadora.tricoetal.com.br、Armatage Candle Company、Vento Barcelona、Nandê Botânica、Punto y Lana、frescoco.es、soapcalc.net。各工具页面的「Fuentes / Fontes」栏也列出了对应来源。

## 二、页面

| 工具 | 西语路径 | 葡语路径 | 计算逻辑 |
|---|---|---|---|
| 均匀加减针 | `/es/calculadora-aumentos-disminuciones/` | `/pt/calculadora-aumentos-diminuicoes/` | `src/lib/distribute.ts` |
| 钩针圆形 | `/es/calculadora-circulo-ganchillo/` | `/pt/calculadora-circulo-croche/` | `src/lib/circle.ts` |
| 样片换算 | `/es/calculadora-muestra-tejido/` | `/pt/calculadora-amostra-trico/` | `src/lib/gauge.ts` |
| 蜡烛香精 | `/es/calculadora-velas-fragancia/` | `/pt/calculadora-velas-essencia/` | `src/lib/candle.ts` |

每个工具页都包括：计算器、公式说明、一个算例（例题的数字由单元测试覆盖）、5 条 FAQ（同时输出 FAQPage 结构化数据）、来源链接。另外还有首页、关于、隐私页，两种语言各一套。根路径 `/` 是语言选择页，会按浏览器语言用 JS 跳转到 `/pt/` 或 `/es/`；每个页面的 hreflang 都互相指向对方语言的版本，x-default 指向西语。

蜡烛页的说明：
- 香精比例按「占蜡重的百分比」计算（大多数蜡厂的标注方式），即 `蜡 = 填充量 ÷ (1 + %)`。来源是 Armatage Candle Company 的 candle math。
- 水重换算蜡重的系数：大豆蜡、石蜡、椰子蜡默认取 0.86（多个蜡烛站通行的数值）。蜂蜡取 0.96，这是按蜂蜡密度估算的，**没有找到权威来源**，页面上已提示用户优先使用蜡厂技术资料里的数值。
- 页面有安全说明：不要超过蜡厂规定的最大香精比例，要隔水加热，查看香精的 MSDS，并做燃烧测试。比例超过 12% 时会显示警告。

## 三、需要母语人士审校的页面（上线前必须完成）

所有文案都由 AI 撰写。西语和葡语页面都需要母语人士通读，尤其注意：

1. **全部 `/es/` 页面（7 个）**：针织/钩针术语有地区差异。本站采用西班牙和阿根廷通用的写法（punto bajo、medio punto alto、punto alto、aum、2 juntos）；墨西哥常说「medio punto」，部分地区「tejer」专指棒针。需要确定目标国家后统一用词。
2. **全部 `/pt/` 页面（7 个）**：请巴西母语人士确认 ponto baixo / meio ponto alto / ponto alto、carreira、ourela、aum 的用法。蜡烛页把 FDS 写作「FISPQ」（巴西用法），也需要确认。
3. **优先审校**：`/es/calculadora-velas-fragancia/` 和 `/pt/calculadora-velas-essencia/` 的「Seguridad / Segurança」安全说明；`src/i18n/ui.ts` 里的共用文案。
4. 隐私页（`/es/privacidad/`、`/pt/privacidade/`）只是基本模板。如果面向西班牙/欧盟或巴西（LGPD）流量投放 AdSense，需要补充 CMP（同意管理）说明。

## 四、常用命令

```bash
npm install      # 已在 npmmirror 镜像下验证，astro 固定为 7.4.1
npm test         # 20 个单元测试（含均匀加减针的全量组合检查）
npm run build    # 输出到 dist/（15 个页面 + sitemap-index.xml）
npm run preview  # 本地预览 dist
```

## 五、上线与域名

**当前状态**：已部署到 GitHub Pages。仓库是 https://github.com/bbyyssg/craft-calc （公开）；临时网址是 https://bbyyssg.github.io/craft-calc/ 。每次推送到 `main`，`.github/workflows/deploy.yml` 都会自动跑测试、构建并发布。

**买好 calculadoratejer.com 之后，按下面的步骤切换：**

1. 在 Cloudflare Registrar（或其他注册商）买下 `calculadoratejer.com`。
2. 添加 DNS 记录。在 Cloudflare 里要把代理关掉，设为「仅 DNS」/灰色云朵，否则 GitHub 签发 HTTPS 证书会失败：
   - `A` 记录 `@` 指向 `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`（四条）
   - `CNAME` 记录 `www` 指向 `bbyyssg.github.io`
3. 新建文件 `public/CNAME`，内容只有一行 `calculadoratejer.com`，然后提交并推送。workflow 检测到这个文件后，会自动按根域名构建，canonical 和 hreflang 都会改成正式域名。
4. 到 GitHub 仓库的 Settings → Pages → Custom domain 填入 `calculadoratejer.com`，等证书签发完成后勾选 Enforce HTTPS。
5. 到 Google Search Console 验证域名，提交 `https://calculadoratejer.com/sitemap-index.xml`。
6. **AdSense**：建议有一定自然流量、并补充 1～2 篇教程文章后再申请。审核通过后，把发布商 ID 填到 `src/site.ts` 的 `adsenseClient`，给各页面的 `<AdSlot />` 加上 `slot` 参数，并在 `public/` 下添加 `ads.txt`；同时更新隐私政策，并为欧盟流量启用 Google CMP。
7. 母语审校见第三节，最好在申请 AdSense 之前完成。

注意：本地 `npm install` 用的是 npmmirror 镜像，它生成的 lockfile 曾经缺少版本号，导致 CI 失败。以后如果要更新 lockfile，请用 `npm install --package-lock-only --registry=https://registry.npmjs.org`。

后续扩展：可以加毛线用量（竞争较强，但能和本站工具互相内链）、袖子加针（按行数均匀分布加针，可复用 `evenSplit`）。

## 目录结构

```
src/site.ts                  品牌、域名、AdSense、各语言 URL（PAGES）
src/i18n/ui.ts               共用界面文案（es / pt）
src/lib/*.ts                 纯计算逻辑；calculators.test.ts 为单元测试
src/components/pages/        各页面组件（两种语言的内容都在组件里）
src/pages/es/, src/pages/pt/ 路由薄包装（slug 已本地化）
src/pages/index.astro        根路径语言选择/跳转页
```
