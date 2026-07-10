---
title: AD管理：密碼原則的例外性
description: Active Directory 密碼複雜性原則的套用層級、優先順序與常見誤解。
published: 2021-01-13
updated: 2021-01-13
category: InformationManagement
tags: [AD, ActiveDirectory, password, mcsa]
draft: false
legacyPath: /2021/01/13/AD管理/
cover: /img/banner2101131511.jpg
---
原則結果組顯示用戶端有吃到 OU 的政策，但是怎麼樣測試都還是可以不遵守密碼複雜性原則，爬了資料才發現密碼政策有那麼一點小例外。

## 優先順序

原本的理解是：網域原則優先於本機原則。

一般來說，OU 的 Policy 優先於 Default Policy，但是因為套用的方式不一樣，密碼原則要設定在 **Domain root**：

- Domain root 的 Policy 會套用到真正的 Domain Account
- OU 的 Policy 會套用到 Domain Account 暫存在 Local Computer 的 Cache

### 結論

1. 要在自建 GPO 中設定密碼原則，Default Domain Policy 要清空（未定義）
2. Domain root 的 Default Domain Policy 可能會被 OU 的 GPO 蓋過
3. `gpupdate /force` 要執行到不再出現需要登出或重開機

## 複雜性原則的設定

「定義這個原則」有三種選項：

1. 未定義：密碼可以複雜，也可以不複雜
2. 已啟用：密碼必須符合複雜化
3. 已停用：密碼不可以使用複雜化

如果設定為已停用，那密碼還得不複雜才行。

參考資料：

- [密碼必須符合複雜性需求＝停用，仍無法變更密碼？](https://ithelp.ithome.com.tw/questions/10061146)
- [AD 更改密碼複雜度卻一直都不過關](https://ithelp.ithome.com.tw/questions/10092757)

圖片來源：[Directory](https://www.flickr.com/photos/mwichary/2222752512/)（CC BY 2.0），Marcin Wichary。
