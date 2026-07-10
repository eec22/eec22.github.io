---
title: Linux實作筆記01：WSL啟用SSH終端機連線
description: 在 Windows WSL Ubuntu 啟用 SSH、排查 sshd 與主機金鑰問題的實作紀錄。
published: 2021-01-11
updated: 2021-01-11
category: infrastructure
tags: [linux, ssh, shell, WSL]
draft: false
legacyPath: /2021/01/11/Linux學習筆記01-啟用SSH/
cover: /img/banner2101110937.jpg
---
接觸了各種資料，開發的平台／機器不是用 Unix 基底的 Mac，就是 Linux 家族的 CentOS 或 Ubuntu。國中時期為了玩遊戲在 DOS 系統下學了不少指令，命令列介面對我而言有種莫名的親切感，總覺得學會了有天會用得上，就當作充實自己的實力吧！

這個時代遠端桌面操作跟喝水一樣簡單，Linux 應該也是吧？一邊這麼想著一邊研究著怎麼遠端連線到 Linux，我才知道我太天真了……

據資料了解，Linux 可透過終端機連線，為了開啟 SSH（Secure Shell），一連串的問題就這樣開始了。

系統：Windows 子系統 WSL 的 Ubuntu 18.04

## 連線除錯方式

參數加上 `-v` 可以看詳細資訊：

```shell
ssh -v localhost
```

折騰半天，總結是兩個問題：

1. ssh 有沒有啟用
2. 公鑰跟私鑰有沒有產生

### 1. ssh 有沒有啟用

如果想確認 ssh 有沒有安裝，可以用下面指令確認：

```shell
which ssh  # 用戶端
which sshd # 伺服端
```

因為用的是 WSL 的 Ubuntu 練習，啟用與檢查指令為：

```shell
service ssh start
service ssh status
```

如果出現 `sshd is not running`，就重新啟動。

#### 啟動時的錯誤訊息

```text
/etc/ssh/sshd_config line 56: Bad yes/no argument: Yes
```

表示 `sshd_config` 的設定有錯，yes/no 的參數全部要小寫。

### 2. 公鑰跟私鑰有沒有產生

啟動 ssh 的時候若出現：

```text
Could not load host key: /etc/ssh/ssh_host_rsa_key
Could not load host key: /etc/ssh/ssh_host_ecdsa_key
Could not load host key: /etc/ssh/ssh_host_ed25519_key
```

用 `ll /etc/ssh` 確認 `ssh_host_ecdsa_key`、`ssh_host_ed25519_key`、`ssh_host_rsa_key` 及各自的 `.pub` 檔案是否存在。若不存在：

```shell
ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key
ssh-keygen -t ecdsa -f /etc/ssh/ssh_host_ecdsa_key
ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key
```

之後應該就可以正常連線了。

用錯誤訊息搜尋到的答案並不一定有效，以下列出 client 端連線時遇到的訊息供參考：

```text
Connection closed by 127.0.0.1 port 22
ssh: connect to host localhost port 22: Connection refused
kex_exchange_identification: read: Connection reset by peer
```

圖片來源：[linux_inside](https://www.flickr.com/photos/4everyoung/220412890/)（CC BY-SA 2.0），Adriano Gasparri。
