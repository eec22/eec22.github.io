---
title: 某些規則已停用，當您嘗試在 Outlook 中建立或啟用規則時，會收到錯誤訊息
description: Outlook 轉換 Exchange 帳戶後，郵件規則同步、容量與衝突問題的原因及處理方式。
published: 2021-09-15
updated: 2021-09-15
category: Server
tags: [exchange, mail, rule, outlook]
draft: false
legacyPath: /2021/09/15/某些規則已停用，當您嘗試在-Outlook-中建立或啟用規則時，會收到錯誤訊息/
cover: /img/banner2109151635.jpg
---
案例配置：

- 用戶端：Outlook 2013
- 伺服器：Exchange 2010

（視版本不同，徵狀與原因可能有些微差異。）

## 徵狀

使用者帳戶從 POP3 切換成 Exchange 類型，在 Outlook 端新增或設定完規則、點擊套用時出現：

> 無法將一或多個規則上傳至 Exchange 伺服器，已停用。這可能是因為部分參數不受支援，或沒有足夠的空間可儲存所有的規則。

本次案例另有以下現象：

- 已勾選的規則未執行
- 已勾選的規則被取消勾選
- 未勾選的規則消失不見

## 原因

「都是同步的問題。」

舊資料需要留存並繼續使用原本 PST 檔時，伺服器端無法辨識只存在用戶端電腦上的資料夾。OWA 因此可能無法顯示涉及 PST 資料夾的規則，並顯示：

> 您選取的規則目前無法在 Outlook Web App 中檢視。請使用 Outlook 檢視。

取消勾選時也可能顯示：

> 此版本 Exchange 不支援此 [收件匣] 規則。

此外，Exchange 從 2007 開始，郵件規則容量預設上限為 64KB（此前為 32KB）；POP3 規則沒有相同限制。轉換前規則若已超過上限，切換 Exchange 後就會發生錯誤。

透過 OWA 網頁端觀察比對離線郵件規則與伺服器同步後的結果，可分為三種情況：

**已勾選的規則被取消勾選：**容量不足，超過容量的規則會被取消勾選，排序越下面、越舊的會先被取消。

**未勾選的規則消失不見：**規則衝突後，Outlook 的規則精靈會要求選擇保留離線用戶端版本或伺服器版本。若選擇伺服器版本，未勾選的規則會全部消失不見。

**已勾選的規則未執行：**假設規則容量已超過上限，或規則容量被減少，已建立的規則在 OWA 介面會被取消勾選，而離線端 Outlook 仍然保持勾選。

## 解決方式

提高規則容量上限是最直接的方式，可配置最大容量為 256KB。

**查詢規則容量**

```powershell
get-mailbox -identity <目標mail帳號> | select name,rulesquota
```

**個別變更規則容量**

```powershell
set-mailbox <目標mail帳號> -rulesquota 262144
```

**全部變更規則容量**

```powershell
get-mailbox | set-mailbox -rulesquota 262144
```
