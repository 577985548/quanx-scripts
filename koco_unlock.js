/*
 *
 * Koco Widgets 会员解锁脚本
 * 基于 RevenueCat 订阅系统
 * 正确的产品标识符版本
 *
 * 使用声明：此脚本仅供学习与交流，请在下载使用24小时内删除！
 *
 ====================================
 [rewrite_local]
 # Koco Widgets - subscribers (删除签名)
 ^https://api\.revenuecat\.com/v1/subscribers/.* url script-response-header https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js
 # Koco Widgets - subscribers (修改数据)
 ^https://api\.revenuecat\.com/v1/subscribers/.* url script-response-body https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js
 # Koco Widgets - receipts (删除签名)
 ^https://api\.revenuecat\.com/v1/receipts url script-response-header https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js
 # Koco Widgets - receipts (修改数据)
 ^https://api\.revenuecat\.com/v1/receipts url script-response-body https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js

 [mitm]
 hostname = api.revenuecat.com
 ====================================
 *
 */

let headers = $response.headers;
let body = $response.body;
let url = $request.url;

// 处理响应头（删除签名验证）
if (headers) {
  delete headers['x-signature'];
  delete headers['X-Signature'];
  console.log("✅ 已删除签名头");
  $done({ headers });
}

// 处理响应体（修改会员数据）
if (body) {
  try {
    let obj = JSON.parse(body);

    // 会员数据模板 - 使用正确的权益名称 "Subscription"
    const vipData = {
      "expires_date": "2099-12-31T23:59:59Z",
      "original_purchase_date": "2026-01-01T00:00:00Z",
      "purchase_date": "2026-01-01T00:00:00Z",
      "store": "app_store",
      "is_sandbox": false,
      "ownership_type": "PURCHASED",
      "period_type": "normal"
    };

    // 处理 subscribers API 和 receipts API
    if (obj.subscriber) {
      // 使用正确的权益名称 "Subscription"
      obj.subscriber.entitlements = {
        "Subscription": vipData
      };

      // 使用正确的产品 ID
      obj.subscriber.subscriptions = {
        "com.niko.PocketWidgetsApp.lifetime": {
          ...vipData,
          "unsubscribe_detected_at": null,
          "billing_issues_detected_at": null,
          "store_transaction_id": "999999999999999",
          "auto_resume_date": null
        },
        "com.niko.PocketWidgetsApp.annual": {
          ...vipData,
          "unsubscribe_detected_at": null,
          "billing_issues_detected_at": null,
          "store_transaction_id": "999999999999999",
          "auto_resume_date": null
        },
        "com.niko.PocketWidgetsApp.lifetimePlus": {
          ...vipData,
          "unsubscribe_detected_at": null,
          "billing_issues_detected_at": null,
          "store_transaction_id": "999999999999999",
          "auto_resume_date": null
        }
      };

      console.log("✅ Koco 数据修改成功（正确的标识符）");
    }

    $done({ body: JSON.stringify(obj) });

  } catch (e) {
    console.log("❌ 错误：" + e);
    $done({ body });
  }
}

$done({});
