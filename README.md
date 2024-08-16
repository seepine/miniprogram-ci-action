# action-miniprogram-ci

将 [miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html) 封装为 action，通过 Actions 实现小程序自动化上传/预览。

## 一、用法

appid 和 setting 相关设置将会自动从 `project.config.json` 文件中读取，请确保 `project-path` 参数设置正确

### 1.1 上传

```yml
- name: Miniprogram Ci Upload
  uses: seepine/action-miniprogram-ci@v1
  with:
    project-path: ./dist/build/mp-weixin
    private-key: ${{ secrets.MP_PRIVATE_KEY }}
    version: 1.0.0
    desc: '修复了一些已知问题'
```

### 1.2 预览

默认生成终端二维码，可通过日志查看到所生成二维码

```yml
- name: Miniprogram Ci Preview
  uses: seepine/action-miniprogram-ci@v1
  with:
    mode: preview
    project-path: ./dist/build/mp-weixin
    private-key: ${{ secrets.MP_PRIVATE_KEY }}
    robot: 2 # 可指定与上传不同的 ci 机器人
```

### 1.3 输出内容

默认会将 appid 和 version 输出到 `outputs` 中，后续步骤可通过 `steps.mpci.outputs.appid` 等获取。

同时更可设置输出文件，自定义任何输出内容，例如搭配 `peter-evans/create-or-update-comment@v3` 实现 GitBots 自动将二维码评论到工单或 PR 中。

````yml
- name: Miniprogram Ci Preview
  uses: seepine/action-miniprogram-ci@v1
  with:
    mode: preview
    project-path: ./dist/build/mp-weixin
    private-key: ${{ secrets.MP_PRIVATE_KEY }}
    robot: 2
    # 默认输出在 ./output.txt
    output: |
      **扫码预览**
      ```
      {qrcode}
      ```

- name: Create comment
  uses: peter-evans/create-or-update-comment@v3
  with:
    issue-number: ${{ github.event.pull_request.number }}
    body-path: output.txt # 读取上一步生成的output.txt文件内容
````

## 二、输入（Inputs）

| Name               | Description                                                                                                   | Default               |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------- |
| mode               | ci 模式,可选 upload/preview.                                                                                  | upload                |
| type               | 小程序类型,可选 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin                                         | miniProgram           |
| project-path       | 项目的路径，即 project.config.json 所在的目录,默认根路径，即./, 若 uniapp 项目,一般传入./dist/build/mp-weixin | ./                    |
| private-key        | 私钥,在获取项目属性和上传时用于鉴权使用，在微信公众平台上登录后下载, 建议通过 secrets 设置                    |                       |
| private-key-path   | 私钥完整路径,private-key 为空时使用路径值,例如./private.key                                                   |                       |
| ignores            | 指定需要排除的规则,默认忽略 node_modules 路径                                                                 | node_modules/**/*     |
| version            | 自定义版本号,空则根据时间戳自动生成 YYYY.MMDD.HHmmss                                                          | YYYY.MMDD.HHmmss      |
| desc               | 自定义备注                                                                                                    | 'fix some bug.'       |
| robot              | 指定使用哪一个 ci 机器人,可选值:1 ~ 30                                                                        | 1                     |
| threads            | 指定本地编译过程中开启的线程数                                                                                | 默认获取 cpu 线程数   |
| qrcode-format      | (preview 有效) 返回二维码文件的格式,可选 terminal/image/base64, 可设置 output 参数将其输出到 output 文件中    | terminal              |
| qrcode-output-dest | (preview 有效) 若 qrcode-format 非 terminal 时设置二维码文件输出路径                                          | ./preview-qrcode.png  |
| page-path          | (preview 有效) 预览页面路径                                                                                   |                       |
| search-query       | (preview 有效) 预览页面路径启动参数                                                                           |                       |
| scene              | (preview 有效) 具体含义见场景值列表                                                                           | 1011                  |
| output             | 设置输出文件,可使用{appid},{version},{qrcode}作为占位符                                                       |                       |
| output-path        | 设置输出文件路径                                                                                              | ./output.txt          |
| ci-version         | ci的版本，默认值 `miniprogram-ci@2.0.8`, `tt-ide-cli@0.1.27`                                                      |                       |

## 三、输出（Outputs）

### 3.1 输出参数

通过 `steps.[step_id].outputs.appid` 取值

| Name    | Description          |
| ------- | -------------------- |
| appid   | 读取到的小程序 appid |
| version | 版本号               |

### 3.2 输出文件

设置了 output 输出文本有值，可通过{appid},{version},{qrcode}作为占位符，例如

````yml
- name: Miniprogram Ci Preview
  uses: seepine/action-miniprogram-ci@v1
  with:
    mode: preview
    project-path: ./dist/build/mp-weixin
    private-key: ${{ secrets.MP_PRIVATE_KEY }}
    # 默认输出在 ./output.txt
    output: |
      自动预览完成，appid为{appid}，版本号为{version}
      **扫码预览**
      ```
      {qrcode}
      ```
````
